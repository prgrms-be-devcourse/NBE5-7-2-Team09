package ninegle.Readio.book.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class BookSearchResponseDto {

	private final long id;
	private String name;
	private String image;
	private String categoryMajor;
	private String categorySub;
	private String authorName;
	private BigDecimal rating;
}
