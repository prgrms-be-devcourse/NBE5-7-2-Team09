package ninegle.Readio.book.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Readio - ReviewListResponseDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@AllArgsConstructor
public class ReviewListResponseDto {
	private List<ReviewResponseDto> reviews;
	private PaginationDto pagination;
	private ReviewSummaryDto summary;
}
