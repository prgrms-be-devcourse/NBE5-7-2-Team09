package ninegle.Readio.book.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.dto.PublisherListResponseDto;
import ninegle.Readio.book.dto.PublisherRequestDto;
import ninegle.Readio.book.dto.PublisherResponseDto;
import ninegle.Readio.book.service.PublisherService;
import ninegle.Readio.global.unit.BaseResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/publishers")
public class PublisherController {

	private final PublisherService publisherService;

	@PostMapping
	public ResponseEntity<BaseResponse<PublisherResponseDto>> save(@RequestBody PublisherRequestDto request) {
		return publisherService.save(request);
	}

	@GetMapping
	public ResponseEntity<BaseResponse<PublisherListResponseDto>> getPublishers() {
		return publisherService.getPublisherAll();
	}
}
