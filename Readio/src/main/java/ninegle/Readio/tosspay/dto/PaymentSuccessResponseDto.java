package ninegle.Readio.tosspay.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Builder
public class PaymentSuccessResponseDto {
	private final String orderId; // 제품 id
	private final long amount; //가격
}