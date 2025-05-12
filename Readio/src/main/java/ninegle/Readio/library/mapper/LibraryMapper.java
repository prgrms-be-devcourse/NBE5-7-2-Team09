package ninegle.Readio.library.mapper;

import ninegle.Readio.admin.domain.User;
import ninegle.Readio.library.domain.Library;
import ninegle.Readio.library.dto.NewLibraryRequestDto;
import ninegle.Readio.library.dto.NewLibraryResponseDto;

public class LibraryMapper {

	//DTO에서 라이브러리로
	public static Library toNewLibraryEntity(NewLibraryRequestDto newLibraryRequestDto, User user) {
		return new Library(newLibraryRequestDto.getLibraryName(), user);
	}

	//라이브러리에서 DTO로
	public static NewLibraryResponseDto NewLibrarytoRsponseDto(long libraryid, String libraryname, long userid) {
		NewLibraryResponseDto newLibraryResponseDto = NewLibraryResponseDto.builder()
			.libraryId(libraryid)
			.libraryName(libraryname)
			.userId(userid).build();
		return newLibraryResponseDto;
	}

}
