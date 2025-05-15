package ninegle.Readio.tosspay.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Subscriptiontest {
	// 이 부분들을 포인트 관련으로 수정하면 됨
	@Id
	@GeneratedValue
	private Long id;

	private Long userId;
	private LocalDateTime startDate;
	private LocalDateTime endDate;

	public Subscriptiontest(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
		this.userId = userId;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}