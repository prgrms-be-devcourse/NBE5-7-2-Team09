package ninegle.Readio.library.dto.book;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
@Builder
public class LibraryDto {
	private final long libraryId;
	private final String libraryName;
	private final LocalDateTime createdAt;
	private final LocalDateTime updatedAt;

}
