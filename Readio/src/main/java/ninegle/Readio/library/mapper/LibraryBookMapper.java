package ninegle.Readio.library.mapper;

import ninegle.Readio.library.dto.book.NewLibraryBookRequestDto;

public class LibraryBookMapper {

	public static Long toNewLibraryBook(NewLibraryBookRequestDto libraryBookRequestDto) {
		return libraryBookRequestDto.getBookId();
	}

}
