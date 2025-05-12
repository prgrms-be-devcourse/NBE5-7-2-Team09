package ninegle.Readio.library.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.library.dto.NewLibraryRequestDto;
import ninegle.Readio.library.dto.NewLibraryResponseDto;
import ninegle.Readio.library.service.LibraryService;

@RestController
@RequiredArgsConstructor
public class LibraryController {
	private final LibraryService libraryService;

	//라이브러리 생성
	@PostMapping("/library")
	public ResponseEntity<BaseResponse<NewLibraryResponseDto>> newlibrary(
		@RequestBody NewLibraryRequestDto libraryDto) {
		return libraryService.newLibrary(libraryDto);
	}

}
