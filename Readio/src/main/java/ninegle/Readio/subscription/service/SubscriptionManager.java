package ninegle.Readio.subscription.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.mail.subscription.service.SubscriptionMailSender;
import ninegle.Readio.subscription.domain.Subscription;
import ninegle.Readio.subscription.repository.SubscriptionRepository;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class SubscriptionManager {

	private final SubscriptionRepository subscriptionRepository;
	private final UserRepository userRepository;
	private final SubscriptionMailSender mailSender;

	private static final long SUBSCRIPTION_COST = 14900;

	@Transactional
	public void subscribe(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		Optional<Subscription> optional = subscriptionRepository.findByUserId(userId);
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime exp = now.plusMonths(1);

		if (optional.isPresent()) {
			Subscription subscription = optional.get();

			if (subscription.isActive()) {
				throw new BusinessException(ErrorCode.ALREADY_SUBSCRIBED);
			}
			if (subscription.isCanceled()) {
				throw new BusinessException(ErrorCode.SUBSCRIPTION_CANCELED);
			}

			chargePoints(user);
			subscription.updatePeriod(now, exp);
			subscriptionRepository.save(subscription);

			// 구독 갱신 메일 전송
			mailSender.sendSubscribeMail(user, subscription);
			return;
		}

		// 새로운 구독 생성
		chargePoints(user);
		Subscription newSubscription = Subscription.builder()
			.userId(userId)
			.subDate(now)
			.expDate(exp)
			.canceled(false)
			.build();

		subscriptionRepository.save(newSubscription);

		// 새 구독 생성 메일 전송
		mailSender.sendSubscribeMail(user, newSubscription);
	}

	@Transactional
	public void cancelSubscription(Long userId) {
		Subscription subscription = subscriptionRepository.findByUserId(userId)
			.orElseThrow(() -> new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

		subscription.cancel();
		subscriptionRepository.save(subscription);

		// 구독 취소 메일 전송
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		mailSender.sendCancelMail(user, subscription);
	}

	// 포인트 차감 로직
	private void chargePoints(User user) {
		if (user.getPoint() < SUBSCRIPTION_COST) {
			throw new BusinessException(ErrorCode.NOT_ENOUGH_POINTS);
		}
		user.setPoint(user.getPoint() - SUBSCRIPTION_COST);
	}
}