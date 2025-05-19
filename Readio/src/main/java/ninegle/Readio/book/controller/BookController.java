package ninegle.Readio.book.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.dto.booksearch.BookListResponseDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.service.BookService;
import ninegle.Readio.global.unit.BaseResponse;

/**
 * Readio - BookController
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {

	private final BookService bookService;

	@GetMapping("/{id}")
	public ResponseEntity<BaseResponse<BookResponseDto>> getBookDetail(@PathVariable Long id) {
		return bookService.getBookDetail(id);
	}

	@GetMapping
	public ResponseEntity<BaseResponse<BookListResponseDto>> getBooksByCategoryMajor(
		@RequestParam(name = "category_major", defaultValue = "null") String categoryMajor,
		@RequestParam(defaultValue = "1")
		@Min(value = 1, message = "page는 1 이상이어야 합니다.")
		int page,
		@RequestParam(defaultValue = "3")
		@Min(value = 1, message = "size는 1 이상이어야 합니다.")
		@Max(value = 50, message = "size는 50 이하이어야 합니다.")
		int size
	) {
		return bookService.getBookByCategory(categoryMajor,page,size);
	}

	@GetMapping("/search")
	public ResponseEntity<BaseResponse<BookListResponseDto>> search(@RequestParam(name = "keyword") String keyword,
		@RequestParam(defaultValue = "1")
		@Min(value = 1, message = "page는 1 이상이어야 합니다.")
		int page,
		@RequestParam(defaultValue = "3")
		@Min(value = 1, message = "size는 1 이상이어야 합니다.")
		@Max(value = 50, message = "size는 50 이하이어야 합니다.")
		int size
	) {
		return bookService.searchBooks(keyword, page, size);
	}



	//파일 받아오기 예시 코드
	@GetMapping("/download/{book_id}")
	public ResponseEntity<byte[]> getBookFile(@PathVariable("book_id") Long bookId){
		return bookService.getBookFile(bookId);
	}

}
