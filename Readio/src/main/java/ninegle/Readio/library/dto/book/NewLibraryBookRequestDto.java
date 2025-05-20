package ninegle.Readio.library.dto.book;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class NewLibraryBookRequestDto {
	@NotNull
	private Long bookId;

}
