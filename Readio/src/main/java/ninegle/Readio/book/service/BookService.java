package ninegle.Readio.book.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import ninegle.Readio.admin.app.UserContextService;
import ninegle.Readio.admin.app.UserService;
import ninegle.Readio.admin.domain.User;
import ninegle.Readio.book.Mapper.ReviewMapper;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.Review;
import ninegle.Readio.book.dto.BookEsDto;
import ninegle.Readio.book.dto.PaginationDto;
import ninegle.Readio.book.dto.ReviewListResponseDto;
import ninegle.Readio.book.dto.ReviewRequestDto;
import ninegle.Readio.book.dto.ReviewResponseDto;
import ninegle.Readio.book.dto.ReviewSummaryDto;
import ninegle.Readio.book.repository.BookRepository;

import ninegle.Readio.book.domain.BookSearch;

import ninegle.Readio.book.repository.BookSearchRepository;
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
public class BookService {
	private final BookSearchRepository bookSearchRepository;
	private final BookRepository bookRepository;
	private final UserContextService userContextService;
	private final UserService userService;
	private final ReviewRepository reviewRepository;
	private final ReviewMapper reviewMapper;

	public BookService(BookSearchRepository bookSearchRepository, BookRepository bookRepository,
		UserContextService userContextService, UserService userService, ReviewRepository reviewRepository,
		ReviewMapper reviewMapper) {
		this.bookSearchRepository = bookSearchRepository;
		this.bookRepository = bookRepository;
		this.userContextService = userContextService;
		this.userService = userService;
		this.reviewRepository = reviewRepository;
		this.reviewMapper = reviewMapper;
	}


	public List<BookSearch> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword, keyword);
	}

	public BookSearch save(BookSearch book) {
		return bookSearchRepository.save(book);
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
		User user = userService.getById(userContextService.getCurrentAdminId());
		Book book = getBookById(book_id);
		reviewRepository.save(reviewMapper.toEntity(reviewRequestDto,user,book));
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
		reviewRepository.save(reviewMapper.updateEntity(review,reviewRequestDto));
		return BaseResponse.ok("후기 수정이 정상적으로 수행되었습니다.", HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<ReviewListResponseDto>> getReviewList(Long bookId, int page, int size) {

		Book book = getBookById(bookId);
		Pageable pageable = PageRequest.of(page-1,size);
		long count = reviewRepository.countByBook(book);
		BigDecimal average = reviewRepository.findAverageRatingByBook(book.getId());

		List<Review> reviews = reviewRepository.findReviewsByBook(book,pageable).getContent();
		List<ReviewResponseDto> reviewList=reviewMapper.toResponseDto(reviews);

		PaginationDto paginationDto = reviewMapper.toPaginationDto(count, page, size);
		ReviewSummaryDto summaryDto = reviewMapper.toSummaryDto(count, average);

		ReviewListResponseDto resultResponseDto = reviewMapper.toReviewListResponseDto(reviewList, paginationDto,
			summaryDto);
		return BaseResponse.ok("조회가 성공적으로 수행되었습니다.",resultResponseDto,HttpStatus.OK);
	}
}
