package ninegle.Readio.mypage.mapper;

import ninegle.Readio.admin.domain.User;
import ninegle.Readio.mypage.dto.response.UserInfoDto;

public class MyPageUserMapper {

	public static UserInfoDto toUserInfoDto(User user) {
		return new UserInfoDto(
			user.getEmail(),
			user.getNickname(),
			user.getPhone_number(),
			user.getPoint()
		);
	}
}
