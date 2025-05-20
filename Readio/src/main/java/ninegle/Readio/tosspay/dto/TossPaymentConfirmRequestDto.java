package ninegle.Readio.tosspay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class TossPaymentConfirmRequestDto {
	@NotBlank(message = "결제 키(paymentKey)는 필수 입력값입니다.")
	private String paymentKey;

	@NotBlank(message = "주문 번호(orderId)는 필수 입력값입니다.")
	private String orderId;

	@NotNull(message = "결제 키(paymentKey)는 필수 입력값입니다.")
	private Long amount;
}
