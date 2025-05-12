package ninegle.Readio.admin.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class SingUpRequestDto {
	private final String email;
	private final String password;
	private final String nickname;
	private final String phoneNumber;
}
