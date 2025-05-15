// package ninegle.Readio.subscription.service;
//
// import java.time.LocalDateTime;
// import java.util.Optional;
//
// import org.springframework.stereotype.Service;
//
// import lombok.RequiredArgsConstructor;
// import ninegle.Readio.global.exception.BusinessException;
// import ninegle.Readio.global.exception.domain.ErrorCode;
// import ninegle.Readio.subscription.domain.Subscription;
// import ninegle.Readio.subscription.repository.SubscriptionRepository;
// import ninegle.Readio.user.domain.User;
// import ninegle.Readio.user.repository.UserRepository;
//
// @Service
// @RequiredArgsConstructor
// public class SubscriptionManager {
//
// 	private final SubscriptionRepository subscriptionRepository;
// 	private final UserRepository userRepository;
//
// 	private static final int SUBSCRIPTION_COST = 24900;
//
// 	public void subscribe(Long userId) {
// 		User user = userRepository.findById(userId)
// 			.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
//
// 		Optional<Subscription> optional = subscriptionRepository.findByUserId(userId);
//
// 		if (optional.isPresent()) {
// 			Subscription subscription = optional.get();
//
// 			if (subscription.isActive()) {
// 				throw new BusinessException(ErrorCode.ALREADY_SUBSCRIBED);
// 			}
// 			if (subscription.isCanceled()) {
// 				throw new BusinessException(ErrorCode.SUBSCRIPTION_CANCELED);
// 			}
//
// 			chargePoints(user);
// 			subscription.updatePeriod(LocalDateTime.now(), LocalDateTime.now().plusMonths(1));
// 			subscriptionRepository.save(subscription);
// 			return;
// 		}
//
// 		chargePoints(user);
// 		subscriptionRepository.save(
// 			Subscription.builder()
// 				.userId(userId)
// 				.subDate(LocalDateTime.now())
// 				.expDate(LocalDateTime.now().plusMonths(1))
// 				.canceled(false)
// 				.build()
// 		);
// 	}
//
// 	public void cancelSubscription(Long userId) {
// 		Subscription subscription = subscriptionRepository.findByUserId(userId)
// 			.orElseThrow(() -> new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
//
// 		subscription.cancel();
// 		subscriptionRepository.save(subscription);
// 	}
//
// 	private void chargePoints(User user) {
// 		if (user.getPoint() < SUBSCRIPTION_COST) {
// 			throw new BusinessException(ErrorCode.NOT_ENOUGH_POINTS);
// 		}
// 		user.setPoint(user.getPoint() - SUBSCRIPTION_COST);
// 	}
// }