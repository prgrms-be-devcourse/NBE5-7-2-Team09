// package ninegle.Readio.subscription.domain;
//
// import java.time.LocalDateTime;
//
// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import lombok.AccessLevel;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
//
// @Entity
// @Getter
// @NoArgsConstructor(access = AccessLevel.PROTECTED)
// public class Subscription {
//
// 	@Id
// 	@GeneratedValue(strategy = GenerationType.IDENTITY)
// 	private Long id;
//
// 	private Long userId;
//
// 	private LocalDateTime subDate;
//
// 	private LocalDateTime expDate;
//
// 	@Column(nullable = false)
// 	private boolean canceled;
//
// 	@Builder
// 	public Subscription(Long userId, LocalDateTime subDate, LocalDateTime expDate) {
// 		this.userId = userId;
// 		this.subDate = subDate;
// 		this.expDate = expDate;
// 		this.canceled = false; // 기본값 설정
// 	}
//
// 	// 구독 기간 갱신
// 	public void updatePeriod(LocalDateTime subDate, LocalDateTime expDate) {
// 		this.subDate = subDate;
// 		this.expDate = expDate;
// 	}
//
// 	// 구독 취소
// 	public void cancel() {
// 		this.canceled = true;
// 	}
//
// 	// 구독이 유효한지 확인
// 	public boolean isActive() {
// 		return !canceled && expDate.isAfter(LocalDateTime.now());
// 	}
// }
