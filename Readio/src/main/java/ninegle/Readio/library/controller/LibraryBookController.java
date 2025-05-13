package ninegle.Readio.library.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.library.dto.book.NewLibraryBookRequestDto;
import ninegle.Readio.library.service.LibraryBookService;

@RestController
@RequiredArgsConstructor
public class LibraryBookController {

	private final LibraryBookService libraryBookService;

	//라이브러리에 책 추가
	@PostMapping("/library/{libraryId}")
	public ResponseEntity<BaseResponse<?>> addBook(
		@PathVariable Long libraryId,
		@RequestBody NewLibraryBookRequestDto bookRequestDto) {
		return libraryBookService.newLibraryBook(libraryId, bookRequestDto);
	}

	// //라이브러리에 책들 불러오기
	// @GetMapping("/library/library-books")
	// public ResponseEntity<BaseResponse<?>> listAllBooks(
	// 	@RequestParam(defaultValue = "0") int page,
	// 	@RequestParam(defaultValue = "10") int size) {
	// 	Pageable pageable = PageRequest.of(page, size);
	// 	return libraryBookService.getAllLibraryBooks(pageable);
	//
	// }
}
