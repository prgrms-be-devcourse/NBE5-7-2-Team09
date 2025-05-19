package ninegle.Readio.library.dto.library;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
@Builder
public class UpdateLibraryResponseDto {
	private final long id;
	private final String libraryName;
}
