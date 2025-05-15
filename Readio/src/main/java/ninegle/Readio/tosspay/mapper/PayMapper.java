package ninegle.Readio.tosspay.mapper;

import ninegle.Readio.tosspay.domain.PayRequest;
import ninegle.Readio.tosspay.dto.TossPaymentConfirmRequestDto;

public class PayMapper {

	public static PayRequest TossPaymentRequestToPayMapper(TossPaymentConfirmRequestDto tossPaymentConfirmRequestDto) {
		PayRequest payRequest = PayRequest.builder()
			.amount(tossPaymentConfirmRequestDto.getAmount())
			.orderId(tossPaymentConfirmRequestDto.getOrderId()).build();
		return payRequest;
	}
}
