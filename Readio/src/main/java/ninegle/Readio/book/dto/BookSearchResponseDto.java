package ninegle.Readio.book.dto;

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
	private String description;
	private String image;
	private String isbn;
	private String ecn;
	private LocalDate pubDate;

	private long categoryId;
	private String categoryMajor;
	private String categorySub;
	private String publisherName;
	private String authorName;
}
