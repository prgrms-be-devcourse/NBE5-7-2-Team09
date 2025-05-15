package ninegle.Readio.mail.user.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserMailTemplateProvider {

	public String buildSignupMailBody(String nickname) {
		// 닉네임이 null 또는 공백일 경우 "회원"으로 대체
		String reNickname = StringUtils.hasText(nickname) ? nickname : "회원";

		return String.format("""
			안녕하세요, %s님.
			Readio 회원가입이 완료되었습니다.
			이제 다양한 전자책 서비스를 이용하실 수 있습니다.

			🎁 회원가입을 축하드리며, 50,000포인트를 바로 지급해 드렸습니다!
			포인트는 전자책 구독 및 다양한 서비스 이용에 사용할 수 있습니다.

			앞으로도 Readio는 더 나은 독서 경험을 위해 노력하겠습니다.

			감사합니다.
			Readio 팀 드림

			© 2025. Readio, Inc. All rights reserved.
			본 메일은 발신 전용입니다.

			------------------------------------------------------------
			주식회사 Readio | 프로그래머스 2차 프로젝트 리디오 
			전화번호: 02-123-456 | 전자책서비스를 여러분에게 제공합니다.
			Copyright © 2025 by Readio, Inc. All rights reserved.
			""", reNickname);
	}
}
