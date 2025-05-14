package ninegle.Readio.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class BookSearchResponseDto {

	private String id;
	private String title;
	private String publisher;
	private String author;
}
