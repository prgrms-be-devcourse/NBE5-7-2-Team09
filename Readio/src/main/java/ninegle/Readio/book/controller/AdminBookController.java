package ninegle.Readio.book.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.service.BookService;
import ninegle.Readio.global.unit.BaseResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/books")
public class AdminBookController {
	private final BookService bookService;

	@PostMapping
	public ResponseEntity<BaseResponse<Void>> save(@RequestBody BookRequestDto request) {
		return bookService.save(request);
	}

	@PutMapping("/{id}")
	public ResponseEntity<BaseResponse<Void>> updateBook(@PathVariable Long id, @RequestBody BookRequestDto request) {
		return bookService.updateBook(id,request);
	}

}
