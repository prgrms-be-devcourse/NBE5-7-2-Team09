package ninegle.Readio.subscription.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SubscriptionResponseDto {

	private final Long userId;
	private final LocalDateTime subDate;
	private final LocalDateTime expDate;
	private final boolean isActive;
	private final boolean isCanceled;

	@Builder
	public SubscriptionResponseDto(Long userId, LocalDateTime subDate, LocalDateTime expDate, boolean isActive, boolean isCanceled) {
		this.userId = userId;
		this.subDate = subDate;
		this.expDate = expDate;
		this.isActive = isActive;
		this.isCanceled = isCanceled;
	}
}

