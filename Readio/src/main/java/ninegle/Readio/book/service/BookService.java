package ninegle.Readio.book.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import ninegle.Readio.adapter.service.NCloudStorageService;
import ninegle.Readio.book.domain.Author;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.domain.Category;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.BookListResponseDto;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.dto.BookSearchResponseDto;
import ninegle.Readio.book.mapper.BookMapper;
import ninegle.Readio.book.mapper.BookSearchMapper;
import ninegle.Readio.book.repository.AuthorRepository;
import ninegle.Readio.book.repository.BookRepository;
import ninegle.Readio.book.repository.BookSearchRepository;
import ninegle.Readio.book.repository.CategoryRepository;
import ninegle.Readio.book.repository.PublisherRepository;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.user.service.UserContextService;
import ninegle.Readio.user.service.UserService;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.book.mapper.ReviewMapper;
import ninegle.Readio.book.domain.Review;
import ninegle.Readio.book.dto.PaginationDto;
import ninegle.Readio.book.dto.ReviewListResponseDto;
import ninegle.Readio.book.dto.ReviewRequestDto;
import ninegle.Readio.book.dto.ReviewResponseDto;
import ninegle.Readio.book.dto.ReviewSummaryDto;
import ninegle.Readio.book.repository.ReviewRepository;
import ninegle.Readio.global.unit.BaseResponse;


/**
 * Readio - BookService
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;
	private final AuthorRepository authorRepository;
	private final CategoryRepository categoryRepository;
	private final PublisherRepository publisherRepository;
	private final BookSearchRepository bookSearchRepository;
	private final UserContextService userContextService;
	private final UserService userService;
	private final ReviewRepository reviewRepository;
	private final ReviewMapper reviewMapper;
  private final NCloudStorageService nCloudStorageService;


	public ResponseEntity<BaseResponse<BookListResponseDto>> searchBooks(String keyword, int page, int size) {

		List<BookSearchResponseDto> findBooks = BookSearchMapper.toResponseDto(getBookSearchList(keyword, page, size));

		long totalElements = findBooks.size();
		PaginationDto paginationDto = BookMapper.toPaginationDto(totalElements, page, size);
		BookListResponseDto response = BookMapper.toBookListResponseDto(findBooks, paginationDto);

		return BaseResponse.ok("검색 결과입니다.", response, HttpStatus.OK);
	}

	private List<BookSearch> getBookSearchList(String keyword, int page, int size) {
		Set<BookSearch> result = new LinkedHashSet<>();

		Pageable pageable = PageRequest.of(page-1, size);
		result.addAll(bookSearchRepository.findByExpiredFalseAndAuthorContaining(keyword, pageable).getContent());
		result.addAll(bookSearchRepository.findByExpiredFalseAndNameContaining(keyword, pageable).getContent());

		return new ArrayList<>(result);
  }

  private void updateRatingInBookSearch(long bookId) {
		BigDecimal rating = reviewRepository.findAverageRatingByBook(bookId);
		if (rating != null) {
			rating = BigDecimal.ZERO;
		}
		BookSearch bookSearch = bookSearchRepository.findById(bookId)
			.orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));
		bookSearch.updateRating(rating);
		bookSearchRepository.save(bookSearch);
  }

	public ResponseEntity<BaseResponse<Void>> save(BookRequestDto request) throws IOException {

		// 1. S3에 업로드할 파일명 생성 ( 책 제목 기반 )
		String fileName = request.getName() + ".epub";

		// 2. S3에 해당 파일 존재 여부 확인
		if (!nCloudStorageService.fileExists(fileName)) {
			nCloudStorageService.uploadFile(fileName, request.getEpubFile());
		}

		// 3. epubUri 생성
		String epubUrl = nCloudStorageService.getFileUrl(fileName);

		// 4. 연관 엔티티 조회
		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		// 5. Book 저장
		Book savedBook = bookRepository.save(BookMapper.toEntity(request, publisher, author, category, epubUrl));

		// 6. ElasticSearch Repository에 저장
		bookSearchRepository.save(BookSearchMapper.toEntity(savedBook));

		return BaseResponse.ok("책 추가가 정상적으로 수행되었습니다.",null, HttpStatus.CREATED);
	}

	// 카테고리가 존재하면 Get, 존재하지 않다면 Throw 발생
	private Category getCategory(String categorySub) {
		return categoryRepository.findBySub(categorySub)
			.orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
	}

	// 작가가 존재하면 해당 작가를 Get, 존재하지 않다면 새로운 작가 생성 후 Get
	private Author getAuthor(String authorName) {
		return authorRepository.findByName(authorName)
			.orElseGet(() -> authorRepository.save(new Author(authorName)));
	}
	// 출판사가 존재하면 해당 출판사 Get, 존재하지 않다면 새로운 출판사 생성 후 Get
	private Publisher getPublisher(String publisherName) {
		return publisherRepository.findByName(publisherName)
			.orElseGet(() -> publisherRepository.save(new Publisher(publisherName)));
	}

	public ResponseEntity<BaseResponse<BookResponseDto>> getBookDetail(Long id) {

		Book findBook = bookRepository.findByIdAndExpiredFalse(id)
			.orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));
		if (findBook.getExpired() == true) {
			// 만료된 책 Enum 추가 필요
			throw new BusinessException(ErrorCode.BOOK_NOT_FOUND);
		}

		return BaseResponse.ok("정상적으로 조회가 완료되었습니다.", BookMapper.toDto(findBook) ,HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<BookResponseDto>> updateBook(Long id, BookRequestDto request) {

		Book targetBook = bookRepository.findById(id)
			.orElseThrow(()->new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		BookSearch targetBookSearch = bookSearchRepository.findById(id)
			.orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		Book updatedBook = targetBook.update(request, category, author, publisher);
		BookSearch updatedBookSearch = targetBookSearch.update(request, category, author);

		bookRepository.save(updatedBook);
		bookSearchRepository.save(updatedBookSearch);

		return BaseResponse.ok("책 수정이 정상적으로 수행되었습니다.", BookMapper.toDto(updatedBook), HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<Void>> deleteBook(Long id) {

		Book findBook = bookRepository.findById(id)
			.orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		BookSearch findBookSearch = bookSearchRepository.findById(id)
			.orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		bookRepository.delete(findBook);

		findBookSearch.softDelete();
		bookSearchRepository.save(findBookSearch);

		return BaseResponse.ok("책 삭제가 정상적으로 수행되었습니다.", null, HttpStatus.OK);
	}

	// TODO: ElasticSearch 적용
	public ResponseEntity<BaseResponse<BookListResponseDto>> getBookByCategory(String categoryMajor, int page, int size) {

		Pageable pageable = PageRequest.of(page-1, size);
		Page<BookSearch> findBooks = categoryMajor.equals("null")
			? bookSearchRepository.findByExpiredFalse(pageable)
			: bookSearchRepository.findByExpiredFalseAndCategoryMajor(categoryMajor, pageable);

		// 총 책의 개수
		long totalElements = findBooks.getTotalElements();

		List<BookSearch> books = findBooks.getContent();
		List<BookSearchResponseDto> responseDtos = BookSearchMapper.toResponseDto(books);
		PaginationDto paginationDto = BookMapper.toPaginationDto(totalElements, page, size);

		return BaseResponse.ok("카테고리별 조회가 정상적으로 수행되었습니다.", BookMapper.toBookListResponseDto(responseDtos, paginationDto), HttpStatus.OK);
	}

	public Book getBookById(long id) {
		return bookRepository.findById(id).orElseThrow(
			() -> new NoSuchElementException());
	}

	public Review getReviewById(long id) {
		return reviewRepository.findById(id).orElseThrow(
			() -> new NoSuchElementException());
	}

	// Review Create
	public ResponseEntity<BaseResponse<Void>> save(ReviewRequestDto reviewRequestDto, long book_id) {
		User user = userService.getById(userContextService.getCurrentUserId());
		Book book = getBookById(book_id);
		updateRatingInBookSearch(book_id);
		reviewRepository.save(reviewMapper.toEntity(reviewRequestDto, user, book));
		return BaseResponse.ok("후기 등록이 정상적으로 수행되었습니다.",null, HttpStatus.CREATED);
	}

	// Review Delete
	public ResponseEntity<BaseResponse<Void>> delete(Long reviewId) {
		Review review = getReviewById(reviewId);
		reviewRepository.delete(review);
		updateRatingInBookSearch(review.getBook().getId());
		return BaseResponse.ok("삭제가 성공적으로 수행되었습니다.", null,HttpStatus.OK);
	}

	// Review Update
	public ResponseEntity<BaseResponse<Void>> update(ReviewRequestDto reviewRequestDto, Long reviewId) {
		Review review = getReviewById(reviewId);
		reviewRepository.save(reviewMapper.updateEntity(review, reviewRequestDto));
		updateRatingInBookSearch(review.getBook().getId());
		return BaseResponse.ok("후기 수정이 정상적으로 수행되었습니다.", null,HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<ReviewListResponseDto>> getReviewList(Long bookId, int page, int size) {

		Book book = getBookById(bookId);
		Pageable pageable = PageRequest.of(page - 1, size);
		long count = reviewRepository.countByBook(book);
		BigDecimal average = reviewRepository.findAverageRatingByBook(book.getId());

		List<Review> reviews = reviewRepository.findReviewsByBook(book, pageable).getContent();
		List<ReviewResponseDto> reviewList = reviewMapper.toResponseDto(reviews);

		PaginationDto paginationDto = reviewMapper.toPaginationDto(count, page, size);
		ReviewSummaryDto summaryDto = reviewMapper.toSummaryDto(count, average);

		ReviewListResponseDto resultResponseDto = reviewMapper.toReviewListResponseDto(reviewList, paginationDto,
			summaryDto);
		return BaseResponse.ok("조회가 성공적으로 수행되었습니다.", resultResponseDto, HttpStatus.OK);
	}

	//파일 받아오기 예시코드
	public ResponseEntity<byte[]> getBookFile(Long bookId) {
		String bookName = getBookById(bookId).getName();
		String bookFileName = bookName + ".epub";
		byte[] downloadFile = nCloudStorageService.downloadFile(bookFileName);


		return ResponseEntity.ok()
			.contentType(MediaType.APPLICATION_OCTET_STREAM)
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + bookFileName + "\"")
			.body(downloadFile);
	}
}