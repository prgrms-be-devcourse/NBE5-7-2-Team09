package ninegle.Readio.library.dto.library;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class LibraryListResponseDto {
	private final List<AllLibraryDto> allLibraries;
	private final long totalCount;
	private final int page;
	private final int size;
}
