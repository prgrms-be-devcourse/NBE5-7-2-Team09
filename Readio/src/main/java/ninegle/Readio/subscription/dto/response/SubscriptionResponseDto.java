package ninegle.Readio.subscription.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
public record SubscriptionResponseDto(Long userId, LocalDateTime subDate, LocalDateTime expDate, boolean active,
									  boolean canceled) {

}
