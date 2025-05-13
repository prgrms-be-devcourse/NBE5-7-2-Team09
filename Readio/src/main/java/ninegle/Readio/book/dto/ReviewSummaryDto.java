package ninegle.Readio.book.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Readio - ReviewSummaryDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@AllArgsConstructor
public class ReviewSummaryDto {
	private BigDecimal averageRating;
	private int totalReviews;
}
