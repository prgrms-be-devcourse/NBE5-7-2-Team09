package ninegle.Readio.book.mapper;

import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.dto.BookRequestDto;

public class BookSearchMapper {


	public static BookSearch toEntity(BookRequestDto dto) {
		return BookSearch.builder()
			.title(dto.getName())
			.publisher(dto.getPublisherName())
			.author(dto.getAuthorName())
			.build();
	}

}
