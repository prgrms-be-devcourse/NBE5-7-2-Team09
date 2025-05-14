package ninegle.Readio.book.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDto {

	private long id;
	private String major;
	private String sub;
}
