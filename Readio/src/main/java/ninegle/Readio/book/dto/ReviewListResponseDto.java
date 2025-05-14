package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - ReviewListResponseDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class ReviewListResponseDto {
	private final List<ReviewResponseDto> reviews;
	private final PaginationDto pagination;
	private final ReviewSummaryDto summary;
}
