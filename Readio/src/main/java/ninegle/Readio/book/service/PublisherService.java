package ninegle.Readio.book.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.PublisherListResponseDto;
import ninegle.Readio.book.dto.PublisherRequestDto;
import ninegle.Readio.book.dto.PublisherResponseDto;
import ninegle.Readio.book.mapper.PublisherMapper;
import ninegle.Readio.book.repository.PublisherRepository;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.global.unit.BaseResponse;

@Service
@Transactional
@RequiredArgsConstructor
public class PublisherService {

	private final PublisherRepository publisherRepository;

	public ResponseEntity<BaseResponse<PublisherResponseDto>> save(PublisherRequestDto dto) {

		if (publisherRepository.findByName(dto.getName()).isPresent()) {
			throw new BusinessException(ErrorCode.PUBLISHER_ALREADY_EXISTS);
		}

		PublisherResponseDto response = PublisherMapper.toResponseDto(publisherRepository.save(new Publisher(dto.getName())));
		return BaseResponse.ok("출판사 등록이 정상적으로 등록되었습니다.", response, HttpStatus.CREATED);
	}

	public ResponseEntity<BaseResponse<PublisherListResponseDto>> getPublisherAll() {
		List<Publisher> response = publisherRepository.findAll();

		PublisherMapper.toListResponseDto(response);
		return BaseResponse.ok("출판사 조회가 정상적으로 수행되었습니다.", PublisherMapper.toListResponseDto(response), HttpStatus.OK);
	}


}
