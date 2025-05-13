package ninegle.Readio.book.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - ReivewResponseDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class ReviewResponseDto {
	private final long id;
	private final String email;
	private final BigDecimal rating;
	private final String text;
	private final LocalDateTime createdAt;
	private final LocalDateTime updatedAt;
}
