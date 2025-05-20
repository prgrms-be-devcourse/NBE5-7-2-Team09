package ninegle.Readio.subscription.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.subscription.dto.response.SubscriptionResponseDto;
import ninegle.Readio.subscription.mapper.SubscriptionMapper;
import ninegle.Readio.subscription.repository.SubscriptionRepository;
import ninegle.Readio.user.service.UserContextService;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

	private final SubscriptionRepository subscriptionRepository;
	private final SubscriptionMapper subscriptionMapper;
	private final UserContextService userContextService;
	private final SubscriptionManager subscriptionManager;

	// 비즈니스 규칙: 구독 ID는 항상 1
	private static final Long SUBSCRIPTION_ID = 1L;

	// 구독 조회
	@Transactional(readOnly = true)
	public SubscriptionResponseDto getSubscription() {
		Long userId = userContextService.getCurrentUserId();
		return subscriptionRepository.findByUserId(userId)
			.map(subscriptionMapper::toDto)
			.orElse(null);
	}

	// 구독 생성 또는 갱신
	@Transactional
	public void createSubscription() {
		Long userId = userContextService.getCurrentUserId();
		subscriptionManager.subscribe(userId);
	}

	// 구독 취소
	@Transactional
	public void cancelSubscription(Long subscriptionId) {
		// 비즈니스 규칙: 구독 ID는 항상 1이어야 함
		if (!SUBSCRIPTION_ID.equals(subscriptionId)) {
			throw new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND);
		}

		Long userId = userContextService.getCurrentUserId();

		// 사용자가 실제로 구독을 가지고 있는지 확인
		boolean hasSubscription = subscriptionRepository.findByUserId(userId).isPresent();
		if (!hasSubscription) {
			throw new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND);
		}

		subscriptionManager.cancelSubscription(userId);
	}
}