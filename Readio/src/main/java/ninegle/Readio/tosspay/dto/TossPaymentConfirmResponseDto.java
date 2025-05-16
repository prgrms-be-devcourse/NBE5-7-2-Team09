package ninegle.Readio.tosspay.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TossPaymentConfirmResponseDto {
	private String orderId;
	private String paymentKey;
	private String status; // 결제 상태 "DONE"
	private String requestedAt;
	private String approvedAt;
	private int totalAmount;
}
