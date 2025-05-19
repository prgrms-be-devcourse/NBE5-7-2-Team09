package ninegle.Readio.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class BookSearchRequestDto {

	private String keyword;
}
