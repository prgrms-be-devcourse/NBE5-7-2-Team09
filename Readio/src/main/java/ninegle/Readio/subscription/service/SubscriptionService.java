package ninegle.Readio.subscription.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
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

	// 구독 조회
	public SubscriptionResponseDto getSubscription() {
		Long userId = userContextService.getCurrentUserId();
		return subscriptionRepository.findByUserId(userId)
			.map(subscriptionMapper::toDto)
			.orElse(null);
	}

	// 구독 생성 또는 갱신
	public void createSubscription() {
		Long userId = userContextService.getCurrentUserId();
		subscriptionManager.subscribe(userId);
	}

	// 구독 취소
	public void cancelSubscription() {
		Long userId = userContextService.getCurrentUserId();
		subscriptionManager.cancelSubscription(userId);
	}
}
