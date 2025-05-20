package ninegle.Readio.publisher.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.publisher.dto.PublisherListResponseDto;
import ninegle.Readio.publisher.dto.PublisherRequestDto;
import ninegle.Readio.publisher.dto.PublisherResponseDto;
import ninegle.Readio.publisher.service.PublisherService;
import ninegle.Readio.global.unit.BaseResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/publishers")
public class PublisherController {

	private final PublisherService publisherService;

	@PostMapping
	public ResponseEntity<BaseResponse<PublisherResponseDto>> save(@RequestBody PublisherRequestDto request) {
		return BaseResponse.ok("출판사 등록이 정상적으로 등록되었습니다.", publisherService.save(request), HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<BaseResponse<PublisherListResponseDto>> getPublishers() {
		return BaseResponse.ok("출판사 조회가 정상적으로 수행되었습니다.", publisherService.getPublisherAll(), HttpStatus.OK);
	}
}
