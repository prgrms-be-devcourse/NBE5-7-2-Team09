package ninegle.Readio.book.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.dto.ReviewListResponseDto;
import ninegle.Readio.book.dto.ReviewRequestDto;
import ninegle.Readio.book.service.BookService;
import ninegle.Readio.global.unit.BaseResponse;

/**
 * Readio - BookController
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {

	private final BookService bookService;

	@GetMapping("/{id}")
	public ResponseEntity<BaseResponse<BookResponseDto>> getBookDetail(@PathVariable Long id) {
		return bookService.getBookDetail(id);
	}

	@GetMapping("/search")
	public List<BookSearch> search(@RequestParam String keyword) {
		return bookService.searchBooks(keyword);
	}

	@PostMapping("/{book_id}/reviews")
	public ResponseEntity<BaseResponse<Void>> save(@RequestBody ReviewRequestDto review,
		@PathVariable("book_id") Long bookId) {
		return bookService.save(review, bookId);
	}

	@DeleteMapping("/{book_id}/reviews/{review_id}")
	public ResponseEntity<BaseResponse<Void>> delete(@PathVariable("review_id") Long reviewId) {
		return bookService.delete(reviewId);
	}

	@PutMapping("/{book_id}/reviews/{review_id}")
	public ResponseEntity<BaseResponse<Void>> update(@RequestBody ReviewRequestDto review,
		@PathVariable("review_id") Long reviewId) {
		return bookService.update(review, reviewId);
	}

	@GetMapping("/{book_id}/reviews")
	public ResponseEntity<BaseResponse<ReviewListResponseDto>> getReviews(@PathVariable("book_id") Long bookId
		, @RequestParam(defaultValue = "1") int page,
		@RequestParam(defaultValue = "3") int size) {
		return bookService.getReviewList(bookId, page, size);
	}
}
