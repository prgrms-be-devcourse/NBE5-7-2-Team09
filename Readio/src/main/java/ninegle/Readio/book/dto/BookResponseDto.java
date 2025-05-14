package ninegle.Readio.book.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Builder
public class BookResponseDto {

	private final long id;
	private final String name;
	private final String description;
	private final String image;
	private final String isbn;
	private final String ecn;
	private final LocalDateTime pubDate;

	private final CategoryDto category;
	private final PublisherDto publisher;
	private final AuthorDto author;

}
