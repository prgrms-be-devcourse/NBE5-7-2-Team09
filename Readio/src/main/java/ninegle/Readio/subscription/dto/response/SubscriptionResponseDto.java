package ninegle.Readio.subscription.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record SubscriptionResponseDto(
	Long userId,
	LocalDateTime subDate,
	LocalDateTime expDate,
	boolean active,
	boolean canceled) {
}