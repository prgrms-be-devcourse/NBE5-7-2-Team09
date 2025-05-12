package ninegle.Readio.book.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Readio - ReviewRequestDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@NoArgsConstructor
public class ReviewRequestDto {
	private BigDecimal rating;

	private String text;

}
