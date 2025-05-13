package ninegle.Readio.book.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Readio - ReivewResponseDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@AllArgsConstructor
public class ReviewResponseDto {
	private long id;
	private String email;
	private BigDecimal rating;
	private String text;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
