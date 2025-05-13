package ninegle.Readio.library.dto.library;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AllLibraryDto {
	private final long id;
	private final String libraryName;
	private final LocalDateTime createAt;
	private final LocalDateTime updateAt;

}
