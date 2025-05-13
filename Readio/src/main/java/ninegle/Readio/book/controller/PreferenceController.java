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
import ninegle.Readio.book.dto.BookIdRequestDto;
import ninegle.Readio.book.dto.BookPreferenceListDto;
import ninegle.Readio.book.dto.ReviewListResponseDto;
import ninegle.Readio.book.dto.ReviewRequestDto;
import ninegle.Readio.book.service.BookService;
import ninegle.Readio.book.service.PreferenceService;
import ninegle.Readio.global.unit.BaseResponse;

/**
 * Readio - PreferenceController
 * create date:    25. 5. 13.
 * last update:    25. 5. 13.
 * author:  gigol
 * purpose: 
 */
@RestController
@RequestMapping("/preferences")
@RequiredArgsConstructor
public class PreferenceController {

	private final PreferenceService service;


	@PostMapping("/")
	public ResponseEntity<BaseResponse<?>> save(@RequestBody BookIdRequestDto dto){
		return service.save(dto);
	}

	@DeleteMapping("/{book_id}")
	public ResponseEntity<BaseResponse<?>> delete(@PathVariable("book_id") Long bookId){
		return service.delete(bookId);
	}

	@GetMapping("/")
	public ResponseEntity<BaseResponse<BookPreferenceListDto>> getPreferences(
		@RequestParam(defaultValue = "1") int page,
		@RequestParam(defaultValue = "3") int size) {
		return service.getPreferenceList(page,size);
	}
}
