package ninegle.Readio.subscription.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.subscription.dto.response.SubscriptionResponseDto;
import ninegle.Readio.subscription.service.SubscriptionService;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

	private final SubscriptionService subscriptionService;

	@GetMapping
	public ResponseEntity<BaseResponse<SubscriptionResponseDto>> getSubscription() {
		SubscriptionResponseDto response = subscriptionService.getSubscription();

		String message = (response == null) ? "존재하는 구독이 없습니다." : "조회에 성공하였습니다.";
		return BaseResponse.ok(message, response, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<BaseResponse<Void>> createSubscription() {
		subscriptionService.createSubscription();

		return BaseResponse.ok("구독 결제에 성공하였습니다.", null, HttpStatus.OK);
	}

	@DeleteMapping("/{subscription_id}")
	public ResponseEntity<BaseResponse<Void>> cancelSubscription(
		@PathVariable("subscription_id") Long subscriptionId) {
		subscriptionService.cancelSubscription(subscriptionId);

		return BaseResponse.ok("구독 취소되었습니다.", null, HttpStatus.OK);
	}
}