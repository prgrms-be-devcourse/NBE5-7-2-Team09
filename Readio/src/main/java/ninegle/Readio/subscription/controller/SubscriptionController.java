package ninegle.Readio.subscription.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.subscription.dto.response.SubscriptionResponseDto;
import ninegle.Readio.subscription.service.SubscriptionService;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

	private final SubscriptionService subscriptionService;

	//구독조회
	@GetMapping
	public ResponseEntity<BaseResponse<SubscriptionResponseDto>> getSubscription() {
		SubscriptionResponseDto response = subscriptionService.getSubscription();

		//구독 정보가 없으면 널을 반환
		if (response == null) {
			return BaseResponse.ok("존재하는 구독이 없습니다.", null, HttpStatus.OK);
		}

		return BaseResponse.ok("조회에 성공하였습니다.", response, HttpStatus.OK);
	}

	//구독결제
	@PostMapping
	public ResponseEntity<BaseResponse<Void>> createSubscription() {
		try {
			subscriptionService.createSubscription();
			return (ResponseEntity<BaseResponse<Void>>) (Object) BaseResponse.ok("구독 결제에 성공하였습니다.", HttpStatus.OK);
		} catch (BusinessException e) {
			return (ResponseEntity<BaseResponse<Void>>) (Object) BaseResponse.error(e.getErrorCode().getMessage(), e.getErrorCode(), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return (ResponseEntity<BaseResponse<Void>>) (Object) BaseResponse.error("알 수 없는 오류가 발생했습니다.", null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




}