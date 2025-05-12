package ninegle.Readio.library.dto;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
public class NewLibraryResponseDto {
	private final long libraryId;
	private final String libraryName;
	public final long userId;

}
