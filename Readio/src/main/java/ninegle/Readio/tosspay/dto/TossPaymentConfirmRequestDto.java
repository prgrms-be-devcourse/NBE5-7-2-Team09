package ninegle.Readio.tosspay.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class TossPaymentConfirmRequestDto {
	private String paymentKey;
	private String orderId;
	private int amount;
}
