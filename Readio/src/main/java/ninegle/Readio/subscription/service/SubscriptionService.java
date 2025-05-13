package ninegle.Readio.subscription.service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.user.repository.UserRepository;
import ninegle.Readio.user.service.UserContextService;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.subscription.domain.Subscription;
import ninegle.Readio.subscription.dto.response.SubscriptionResponseDto;
import ninegle.Readio.subscription.mapper.SubscriptionMapper;
import ninegle.Readio.subscription.repository.SubscriptionRepository;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

	private final SubscriptionRepository subscriptionRepository;
	private final SubscriptionMapper subscriptionMapper;
	private final UserContextService userContextService;
	private final UserRepository userRepository;

	private static final int SUBSCRIPTION_COST = 24900;
	//구독조회
	public SubscriptionResponseDto getSubscription() {
		Long userId = userContextService.getCurrentUserId();
		return subscriptionRepository.findByUserId(userId)
			.map(subscriptionMapper::toDto)
			.orElse(null);
	}
	// 구독 결제 및 갱신
	public void createSubscription() {
		Long userId = userContextService.getCurrentUserId();

		// 사용자 조회
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		// 기존 구독 확인
		Optional<Subscription> optional = subscriptionRepository.findByUserId(userId);

		if (optional.isPresent()) {
			Subscription subscription = optional.get();
			// 구독이 아직 유효하다면 예외
			if (subscription.isActive()) {
				throw new BusinessException(ErrorCode.ALREADY_SUBSCRIBED);
			}
			// 구독이 만료된 경우 → 갱신
			if (user.getPoint() < SUBSCRIPTION_COST) {
				throw new BusinessException(ErrorCode.NOT_ENOUGH_POINTS);
			}

			// 포인트 차감
			user.setPoint(user.getPoint() - SUBSCRIPTION_COST);

			// 구독 기간 갱신 및 활성화
			subscription.updatePeriod(LocalDateTime.now(), LocalDateTime.now().plusMonths(1));
			subscriptionRepository.save(subscription);
			return;
		}
		// 구독이 아예 없는 경우 → 신규 구독 생성
		if (user.getPoint() < SUBSCRIPTION_COST) {
			throw new BusinessException(ErrorCode.NOT_ENOUGH_POINTS);
		}

		// 포인트 차감
		user.setPoint(user.getPoint() - SUBSCRIPTION_COST);

		// 새 구독은 활성 상태로 생성
		subscriptionRepository.save(
			Subscription.builder()
				.userId(userId)
				.subDate(LocalDateTime.now())
				.expDate(LocalDateTime.now().plusMonths(1))
				.build()
		);
	}

	//취소 처리
	public void cancelSubscription() {
		Long userId = userContextService.getCurrentUserId();

		// 현재 사용자의 구독 정보 조회
		Subscription subscription = subscriptionRepository.findByUserId(userId)
			.orElseThrow(() -> new NoSuchElementException("존재하지 않는 구독입니다."));

		// 구독 즉시 만료 처리 (현재 시간으로 만료일 설정)
		LocalDateTime now = LocalDateTime.now();
		subscription.updatePeriod(subscription.getSubDate(), now);
		subscriptionRepository.save(subscription);
	}
}
