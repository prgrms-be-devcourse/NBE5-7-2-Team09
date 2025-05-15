package ninegle.Readio.mail.subscription.service;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import ninegle.Readio.subscription.domain.Subscription;

@Service
public class SubscriptionMailTemplateProvider {

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	//구독 결제 완료때 템플릿
	public String buildSubscribeMailBody(String nickname, Subscription subscription) {
		return String.format("""
   안녕하세요, %s님.
   구독 결제가 완료되었습니다.
   %s님, Readio를 이용해 주셔서 감사드려요.

   구독 정보를 안내해 드립니다.
   총 결제 금액: 14,900원
   구독 시작일: %s
   구독 종료일: %s

   감사합니다.
   Readio 팀 드림



   © 2025. Readio, Inc. All rights reserved.
   본 메일은 발신 전용입니다.

 
   ------------------------------------------------------------
   주식회사 Readio | 프로그래머스 2차 프로젝트 리디오 
   전화번호: 02-123-456 | 전자책서비스를 여러분에게 제공합니다.
   Copyright © 2025 by Readio, Inc. All rights reserved.
   """,
			nickname,
			nickname,
			subscription.getSubDate().format(formatter),
			subscription.getExpDate().format(formatter)
		);
	}

	//구독 취소시 템플릿
	public String buildCancelMailBody(String nickname, Subscription subscription) {
		return String.format("""
   안녕하세요, %s님.
   구독 취소가 완료되었습니다.
   %s님, Readio를 이용해 주셔서 감사드려요.

   구독권 정보를 안내해 드립니다.
   구독 종료일: %s 까지는 서비스 이용 가능합니다.

   감사합니다.
   Readio 팀 드림



   © 2025. Readio, Inc. All rights reserved.
   본 메일은 발신 전용입니다.


   ------------------------------------------------------------
   주식회사 Readio | 프로그래머스 2차 프로젝트 리디오 
   전화번호: 02-123-456 | 전자책서비스를 여러분에게 제공합니다.
   Copyright © 2025 by Readio, Inc. All rights reserved.
   """,
			nickname,
			nickname,
			subscription.getExpDate().format(formatter)
		);
	}
}
