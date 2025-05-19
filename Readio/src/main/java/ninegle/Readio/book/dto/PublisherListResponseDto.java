package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublisherListResponseDto {
	List<PublisherResponseDto> publishers;
}
