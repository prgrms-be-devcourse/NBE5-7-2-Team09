package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - BookPreferenceListDto
 * create date:    25. 5. 13.
 * last update:    25. 5. 13.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class BookPreferenceListDto {
	private final List<BookPreferenceDto> preferences;
	private final PaginationDto pagination;
}
