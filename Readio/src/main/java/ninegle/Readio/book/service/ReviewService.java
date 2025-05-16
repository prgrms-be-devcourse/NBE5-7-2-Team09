package ninegle.Readio.book.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.domain.Review;
import ninegle.Readio.book.dto.PaginationDto;
import ninegle.Readio.book.dto.reviewdto.ReviewListResponseDto;
import ninegle.Readio.book.dto.reviewdto.ReviewRequestDto;
import ninegle.Readio.book.dto.reviewdto.ReviewResponseDto;
import ninegle.Readio.book.dto.reviewdto.ReviewSummaryDto;
import ninegle.Readio.book.mapper.ReviewMapper;
import ninegle.Readio.book.repository.BookSearchRepository;
import ninegle.Readio.book.repository.ReviewRepository;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.user.service.UserContextService;
import ninegle.Readio.user.service.UserService;

/**
 * Readio - ReviewService
 * create date:    25. 5. 16.
 * last update:    25. 5. 16.
 * author:  gigol
 * purpose: 
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
	private final BookService bookService;

	private final ReviewRepository reviewRepository;
	private final ReviewMapper reviewMapper;
	private final UserService userService;
	private final UserContextService userContextService;
	private final BookSearchRepository bookSearchRepository;


	public Review getReviewById(long id) {
		return reviewRepository.findById(id).orElseThrow(
			() -> new NoSuchElementException());
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

	// Review Create
	public ResponseEntity<BaseResponse<Void>> save(ReviewRequestDto reviewRequestDto, long book_id) {
		User user = userService.getById(userContextService.getCurrentUserId());
		Book book = bookService.getBookById(book_id);
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

		Book book = bookService.getBookById(bookId);
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
