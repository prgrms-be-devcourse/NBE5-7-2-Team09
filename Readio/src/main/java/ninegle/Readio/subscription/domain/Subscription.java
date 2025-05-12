package ninegle.Readio.subscription.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Subscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	private LocalDateTime subDate;

	private LocalDateTime expDate;

	@Builder
	public Subscription(Long userId, LocalDateTime subDate, LocalDateTime expDate) {
		this.userId = userId;
		this.subDate = subDate;
		this.expDate = expDate;
	}

	public void updatePeriod(LocalDateTime subDate, LocalDateTime expDate) {
		this.subDate = subDate;
		this.expDate = expDate;
	}

	public boolean isActive() {
		return expDate.isAfter(LocalDateTime.now());
	}
}


