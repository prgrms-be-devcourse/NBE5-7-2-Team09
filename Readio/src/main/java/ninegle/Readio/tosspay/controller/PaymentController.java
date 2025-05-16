package ninegle.Readio.tosspay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.tosspay.dto.PaymentSuccessResponseDto;
import ninegle.Readio.tosspay.dto.TossPaymentConfirmRequestDto;
import ninegle.Readio.tosspay.service.PaymentService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
// Toss 결제 성공 후 백엔드에서 결제를 최종 승인하고 구독권을 부여하는 엔드포인트
public class PaymentController {

	private final PaymentService paymentService;

	@PostMapping("/confirm")
	public ResponseEntity<BaseResponse<PaymentSuccessResponseDto>> confirm(
		@RequestBody TossPaymentConfirmRequestDto request) {
		log.info("confirm request: {}", request.getOrderId());
		log.info("confirm request: {}", request.getPaymentKey());
		log.info("confirm request: {}", request.getAmount());

		return paymentService.confirmPayment(request);
	}
}