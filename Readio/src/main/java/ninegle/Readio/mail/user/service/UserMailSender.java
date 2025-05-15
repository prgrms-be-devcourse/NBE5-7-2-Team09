package ninegle.Readio.mail.user.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ninegle.Readio.user.domain.User;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserMailSender {

	private final JavaMailSender mailSender;
	private final UserMailTemplateProvider templateProvider;

	@Async
	public void sendSignupMail(User user) {
		String subject = "[Readio] 회원가입을 환영합니다!";
		String body = templateProvider.buildSignupMailBody(user.getNickname());
		send(user.getEmail(), subject, body);
	}

	private void send(String to, String subject, String body) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(to);
			message.setSubject(subject);
			message.setText(body);
			mailSender.send(message);

			log.info("회원가입 메일 전송 완료: {}", to);
		} catch (Exception e) {
			log.error("회원가입 메일 전송 실패: {}", to, e);
		}
	}
}
