package ninegle.Readio.mypage.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserInfoDto {
	private final String email;
	private final String nickname;
	private final String phoneNumber;
	private final long point;
}
