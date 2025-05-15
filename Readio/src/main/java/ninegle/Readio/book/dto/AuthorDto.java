package ninegle.Readio.book.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthorDto {

	private long id;
	private String name;
}
