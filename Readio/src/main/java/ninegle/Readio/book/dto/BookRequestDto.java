package ninegle.Readio.book.dto;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookRequestDto {

	private String categorySub;
	private String publisherName;
	private String authorName;

	private String name;
	private String description;
	private String image;
	private String isbn;
	private String ecn;
	private LocalDate pubDate;
	private MultipartFile epubFile;
}
