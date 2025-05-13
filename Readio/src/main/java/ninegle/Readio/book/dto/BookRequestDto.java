package ninegle.Readio.book.dto;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BookRequestDto {

	private String categorySub;
	private String publisherName;
	private String authorName;

	private String name;
	private String description;
	private String image;
	private String isbn;
	private String ecn;
	private LocalDateTime pubDate;

}
