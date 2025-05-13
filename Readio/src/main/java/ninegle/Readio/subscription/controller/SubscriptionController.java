package ninegle.Readio.subscription.controller;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

	//구독취소
	@DeleteMapping("/{subscription_id}")
	public ResponseEntity<BaseResponse<Void>> cancelSubscription(@PathVariable("subscription_id") Long subscriptionId) {
		try {
			// 구독 ID는 항상 1 (요구사항에 명시됨)
			if (subscriptionId != 1) {
				return BaseResponse.error("존재하지 않는 구독입니다.", null, HttpStatus.NOT_FOUND);
			}

			subscriptionService.cancelSubscription();
			return BaseResponse.ok("구독 취소되었습니다.", null, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return BaseResponse.error("존재하지 않는 구독입니다.", null, HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return BaseResponse.error("서버 내부 오류가 발생했습니다.", null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




}