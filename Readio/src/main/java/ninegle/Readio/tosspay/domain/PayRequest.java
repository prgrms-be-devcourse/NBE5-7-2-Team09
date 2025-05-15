package ninegle.Readio.tosspay.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Builder
public class PayRequest {
	private final String orderId;
	private final int amount;
}
