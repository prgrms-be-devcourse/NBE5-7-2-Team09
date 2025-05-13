package ninegle.Readio.library.dto.book;

import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class LibraryBookListResponseDto {
	private final List<AllLibraryBooksDto> allLibraryBooks;
	private final long totalCount;
	private final long page;
	private final long size;

}
