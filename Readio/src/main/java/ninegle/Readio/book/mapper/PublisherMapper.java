package ninegle.Readio.book.mapper;

import java.util.ArrayList;
import java.util.List;

import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.PublisherListResponseDto;
import ninegle.Readio.book.dto.PublisherResponseDto;

public class PublisherMapper {

	public static PublisherResponseDto toResponseDto(Publisher publisher) {
		return PublisherResponseDto.builder()
			.id(publisher.getId())
			.name(publisher.getName())
			.build();
	}

	public static PublisherListResponseDto toListResponseDto(List<Publisher> publishers) {
		List<PublisherResponseDto> publisherDtos = new ArrayList<>();

		for (Publisher publisher : publishers) {
			publisherDtos.add(toResponseDto(publisher));
		}
		return PublisherListResponseDto.builder()
			.publishers(publisherDtos)
			.build();

	}

}
