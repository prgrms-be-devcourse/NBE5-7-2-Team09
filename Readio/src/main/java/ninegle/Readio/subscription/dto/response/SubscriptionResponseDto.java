package ninegle.Readio.subscription.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class SubscriptionResponseDto {

	private final Long userId;
	private final LocalDateTime subDate;
	private final LocalDateTime expDate;
	private final boolean active;
	private final boolean canceled;
}
