package ninegle.Readio.book.dto.preferencedto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - BookPreferenceDto
 * create date:    25. 5. 13.
 * last update:    25. 5. 13.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class PreferenceResponseDto {
	private final long id;
	private final String name;
	private final String image;
}
