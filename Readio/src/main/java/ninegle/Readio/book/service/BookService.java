package ninegle.Readio.book.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.domain.Author;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.domain.Category;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
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

	public List<BookSearch> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword,
			keyword);
	}

	public ResponseEntity<BaseResponse<?>> save(BookRequestDto request) {

		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		bookRepository.save(BookMapper.toEntity(request, publisher, author, category));
		// ElasticSearch Repository에 저장
		bookSearchRepository.save(BookSearchMapper.toEntity(request));

		return BaseResponse.ok("책 추가가 정상적으로 수행되었습니다.", HttpStatus.CREATED);
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

		Optional<Book> bookOptional = bookRepository.findById(id);
		if (bookOptional.isEmpty()) {
			throw new BusinessException(ErrorCode.BOOK_NOT_FOUND);
		}

		return BaseResponse.ok("정상적으로 조회가 완료되었습니다.", BookMapper.toDto(bookOptional.get()) ,HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<?>> updateBook(Long id, BookRequestDto request) {

		Book targetBook = bookRepository.findById(id)
			.orElseThrow(()->new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		targetBook.update(request, category, author, publisher);

		return BaseResponse.ok("책 수정이 정상적으로 수행되었습니다.", HttpStatus.OK);
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
	public ResponseEntity<BaseResponse<?>> save(ReviewRequestDto reviewRequestDto, long book_id) {
		User user = userService.getById(userContextService.getCurrentUserId());
		Book book = getBookById(book_id);
		reviewRepository.save(reviewMapper.toEntity(reviewRequestDto, user, book));
		return BaseResponse.ok("후기 등록이 정상적으로 수행되었습니다.", HttpStatus.CREATED);
	}

	// Review Delete
	public ResponseEntity<BaseResponse<?>> delete(Long reviewId) {
		Review review = getReviewById(reviewId);
		reviewRepository.delete(review);
		return BaseResponse.ok("삭제가 성공적으로 수행되었습니다.", HttpStatus.OK);
	}

	// Review Update
	public ResponseEntity<BaseResponse<?>> update(ReviewRequestDto reviewRequestDto, Long reviewId) {
		Review review = getReviewById(reviewId);
		reviewRepository.save(reviewMapper.updateEntity(review, reviewRequestDto));
		return BaseResponse.ok("후기 수정이 정상적으로 수행되었습니다.", HttpStatus.OK);
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
}