package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class BookListResponseDto {
	private final List<BookSearchResponseDto> books;
	private final PaginationDto pagination;
}
