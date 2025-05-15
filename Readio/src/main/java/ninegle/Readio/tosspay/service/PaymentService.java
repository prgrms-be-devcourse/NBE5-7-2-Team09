package ninegle.Readio.tosspay.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.tosspay.config.TossApiClient;
import ninegle.Readio.tosspay.domain.Subscriptiontest;
import ninegle.Readio.tosspay.dto.PaymentSuccessResponseDto;
import ninegle.Readio.tosspay.dto.TossPaymentConfirmRequestDto;
import ninegle.Readio.tosspay.dto.TossPaymentConfirmResponseDto;
import ninegle.Readio.tosspay.repository.SubscriptiontestRepository;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.user.repository.UserRepository;
import ninegle.Readio.user.service.UserContextService;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

	private final TossApiClient tossApiClient;
	private final SubscriptiontestRepository subscriptiontestRepository;
	private final UserContextService userContextService;
	private final UserRepository userRepository;

	@Value("${toss.secret-key}")
	private String secretKey;

	public ResponseEntity<BaseResponse<PaymentSuccessResponseDto>> confirmPayment(
		TossPaymentConfirmRequestDto tossRequest) {

		//유저 검증
		Long userId = userContextService.getCurrentUserId();
		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			return BaseResponse.error("❌ 유저가 존재하지 않음", null, HttpStatus.BAD_REQUEST);
		}

		//인증 헤더 생성
		String encodedKey = Base64.getEncoder().encodeToString((secretKey + ":").getBytes());

		// Feign 요청
		TossPaymentConfirmResponseDto response = tossApiClient.confirmPayment(
			"Basic " + encodedKey, tossRequest);

		if (!"DONE".equals(response.getStatus())) {
			return BaseResponse.error("❌ 결제 승인 실패: " + response.getStatus(), null, HttpStatus.BAD_REQUEST);
		}

		LocalDateTime now = LocalDateTime.now();
		Subscriptiontest subscription = new Subscriptiontest(userId, now, now.plusMonths(1));
		subscriptiontestRepository.save(subscription);

		//객체 생성 후 반환 코드 필요
		PaymentSuccessResponseDto paymentSuccessResponseDto = PaymentSuccessResponseDto.builder()
			.orderId(tossRequest.getOrderId())
			.amount(tossRequest.getAmount()).build();

		return BaseResponse.ok("결제 완료", paymentSuccessResponseDto, HttpStatus.OK);
	}
}