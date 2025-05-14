package ninegle.Readio.book.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - ReviewSummaryDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class ReviewSummaryDto {
	private final BigDecimal averageRating;
	private final int totalReviews;
}
