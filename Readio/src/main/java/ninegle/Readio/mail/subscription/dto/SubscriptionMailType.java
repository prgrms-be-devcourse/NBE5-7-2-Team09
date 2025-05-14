package ninegle.Readio.mail.subscription.dto;

public enum SubscriptionMailType {
	SUBSCRIBED("구독 결제가 완료되었습니다."),
	CANCELED("구독이 취소되었습니다.");

	private final String subject;

	SubscriptionMailType(String subject) {
		this.subject = subject;
	}

	public String getSubject() {
		return subject;
	}
}
