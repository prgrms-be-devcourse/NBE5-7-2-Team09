package ninegle.Readio.book.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.dto.reviewdto.ReviewListResponseDto;
import ninegle.Readio.book.dto.reviewdto.ReviewRequestDto;
import ninegle.Readio.book.service.ReviewService;
import ninegle.Readio.global.unit.BaseResponse;

/**
 * Readio - ReviewController
 * create date:    25. 5. 16.
 * last update:    25. 5. 16.
 * author:  gigol
 * purpose: 
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class ReviewController {

	private final ReviewService reviewService;

	@PostMapping("/{book_id}/reviews")
	public ResponseEntity<BaseResponse<Void>> save(@RequestBody ReviewRequestDto review,
		@PathVariable("book_id") Long bookId) {
		return reviewService.save(review, bookId);
	}

	@DeleteMapping("/{book_id}/reviews/{review_id}")
	public ResponseEntity<BaseResponse<Void>> delete(@PathVariable("review_id") Long reviewId) {
		return reviewService.delete(reviewId);
	}

	@PutMapping("/{book_id}/reviews/{review_id}")
	public ResponseEntity<BaseResponse<Void>> update(@RequestBody ReviewRequestDto review,
		@PathVariable("review_id") Long reviewId) {
		return reviewService.update(review, reviewId);
	}

	@GetMapping("/{book_id}/reviews")
	public ResponseEntity<BaseResponse<ReviewListResponseDto>> getReviews(@PathVariable("book_id") Long bookId
		, @RequestParam(defaultValue = "1") int page,
		@RequestParam(defaultValue = "3") int size) {
		return reviewService.getReviewList(bookId, page, size);
	}

}
