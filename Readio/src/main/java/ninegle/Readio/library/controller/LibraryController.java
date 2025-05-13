package ninegle.Readio.library.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.library.dto.library.LibraryListResponseDto;
import ninegle.Readio.library.dto.library.NewLibraryRequestDto;
import ninegle.Readio.library.dto.library.NewLibraryResponseDto;
import ninegle.Readio.library.dto.library.UpdateLibraryRequestDto;
import ninegle.Readio.library.dto.library.UpdateLibraryResponseDto;
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

	//라이브러리 전체 목록 조회
	@GetMapping("/library")
	public ResponseEntity<BaseResponse<LibraryListResponseDto>> getAllLibrary(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return libraryService.getAllLibraries(pageable);
	}

	//특정 라이브러리 삭제
	@DeleteMapping("/library/{libraryId}")
	public ResponseEntity<BaseResponse<Void>> deleteLibrary(
		@PathVariable("libraryId") Long libraryId) {
		return libraryService.deleteLibrary(libraryId);
	}

	//라이브러리 이름 수정
	@PutMapping("/library/{libraryId}")
	public ResponseEntity<BaseResponse<UpdateLibraryResponseDto>> updateLibrary(
		@PathVariable("libraryId") Long libraryId,
		@RequestBody UpdateLibraryRequestDto reqeustDto) {
		return libraryService.updateLibrary(libraryId, reqeustDto);
	}
}
