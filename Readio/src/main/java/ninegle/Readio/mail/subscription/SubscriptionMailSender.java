package ninegle.Readio.mail.subscription;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ninegle.Readio.mail.subscription.dto.SubscriptionMailType;
import ninegle.Readio.user.domain.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async; // 비동기 처리 어노테이션 추가
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionMailSender {

	private final JavaMailSender mailSender;

	@Async // 메일 전송을 비동기적으로 처리
	public void send(User user, SubscriptionMailType type) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(user.getEmail());
			helper.setSubject(type.getSubject());
			helper.setText(generateBody(user, type), true);

			mailSender.send(message);
			log.info("메일 전송 완료: {} - {}", user.getEmail(), type.name());
		} catch (MessagingException e) {
			log.error("메일 전송 실패: {}", e.getMessage());
		}
	}

	private String generateBody(User user, SubscriptionMailType type) {
		return String.format("""
			<html>
				<body>
					<p>안녕하세요, %s님.</p>
					<p>%s</p>
					<p>Readio 서비스를 이용해주셔서 감사합니다.</p>
				</body>
			</html>
			""", user.getNickname(), type.getSubject());
	}
}
