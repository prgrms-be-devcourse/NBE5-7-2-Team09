package ninegle.Readio.library.dto.library;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
@Getter
@RequiredArgsConstructor
public class NewLibraryResponseDto {
	private final long libraryId;
	private final String libraryName;
	private final long userId;

}
