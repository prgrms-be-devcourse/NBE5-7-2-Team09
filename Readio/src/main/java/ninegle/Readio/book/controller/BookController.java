package ninegle.Readio.book.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ninegle.Readio.book.dto.BookEsDto;
import ninegle.Readio.book.service.BookService;

/**
 * Readio - BookController
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose: 
 */
@RestController
@RequestMapping("/books")
public class BookController {

	private final BookService bookService;

	public BookController(BookService bookService) {
		this.bookService = bookService;
	}

	@PostMapping
	public BookEsDto save(@RequestBody BookEsDto book) {

		return bookService.save(book);
	}

	@GetMapping("/search")
	public List<BookEsDto> search(@RequestParam String keyword) {
		return bookService.searchBooks(keyword);
	}
}
