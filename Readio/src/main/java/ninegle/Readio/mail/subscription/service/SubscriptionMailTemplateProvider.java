package ninegle.Readio.mail.subscription.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import ninegle.Readio.subscription.domain.Subscription;

@Service
public class SubscriptionMailTemplateProvider {

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	// 구독 결제 완료 템플릿
	public String buildSubscribeMailBody(String nickname, Subscription subscription) {
		String reNickname = StringUtils.hasText(nickname) ? nickname : "회원";

		return String.format("""
		안녕하세요, %s님.
		Readio의 세계에 오신 것을 진심으로 환영합니다!

		%s님께서 구독을 완료해 주셨습니다.
		앞으로 전자책의 새로운 경험과 다양한 콘텐츠를 자유롭게 즐기실 수 있습니다.

		📌 구독 정보 안내
		• 총 결제 금액: 14,900원
		• 구독 시작일: %s
		• 구독 종료일: %s

		지금부터 Readio와 함께 지식과 이야기로 가득 찬 여정을 시작해 보세요.
		항상 최선을 다하는 Readio가 되겠습니다.

		감사합니다.
		Readio 팀 드림

		© 2025. Readio, Inc. All rights reserved.
		본 메일은 발신 전용입니다.

		------------------------------------------------------------
		주식회사 Readio | 프로그래머스 2차 프로젝트 리디오 
		전화번호: 02-123-456 | 전자책서비스를 여러분에게 제공합니다.
		Copyright © 2025 by Readio, Inc. All rights reserved.
		""",
			reNickname,
			reNickname,
			subscription.getSubDate().format(formatter),
			subscription.getExpDate().format(formatter)
		);
	}


	// 구독 취소 템플릿
	public String buildCancelMailBody(String nickname, Subscription subscription) {
		String reNickname = StringUtils.hasText(nickname) ? nickname : "회원";

		return String.format("""
		안녕하세요, %s님.
		Readio를 이용해 주셔서 진심으로 감사드립니다.

		%s님의 구독이 성공적으로 취소되었습니다.
		아래 기간까지는 서비스 이용이 가능하오니 참고 부탁드립니다.

		📌 구독 이용 가능 기간
		• 종료일: %s

		그동안 함께 해주셔서 감사했고,
		언제든 다시 찾아오실 수 있도록 더욱 나은 서비스를 준비하겠습니다.

		감사합니다.
		Readio 팀 드림

		© 2025. Readio, Inc. All rights reserved.
		본 메일은 발신 전용입니다.

		------------------------------------------------------------
		주식회사 Readio | 프로그래머스 2차 프로젝트 리디오 
		전화번호: 02-123-456 | 전자책서비스를 여러분에게 제공합니다.
		Copyright © 2025 by Readio, Inc. All rights reserved.
		""",
			reNickname,
			reNickname,
			subscription.getExpDate().format(formatter)
		);
	}

}
