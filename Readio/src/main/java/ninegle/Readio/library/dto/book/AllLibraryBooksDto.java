package ninegle.Readio.library.dto.book;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Builder
public class AllLibraryBooksDto {
	private final Long BookId;
	private final String BookName;
	private final String bookImage;
	private final String bookIsbn;
	private final String bookEcn;
	private final LocalDate bookPubDate;
	private final LocalDate bookUpdateAt;

}
