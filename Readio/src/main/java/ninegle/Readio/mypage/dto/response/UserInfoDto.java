package ninegle.Readio.mypage.dto.response;

import lombok.Data;

@Data
public class UserInfoDto {
	private final String email;
	private final String nickname;
	private final String phoneNumber;
	private final long point;
}
