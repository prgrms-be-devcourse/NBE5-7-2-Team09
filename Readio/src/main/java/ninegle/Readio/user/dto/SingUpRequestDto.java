package ninegle.Readio.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SingUpRequestDto {
	@NotBlank(message = "닉네임은 필수 입력값입니다.")
	private String email;

	@NotBlank(message = "닉네임은 필수 입력값입니다.")
	private String password;

	@NotBlank(message = "닉네임은 필수 입력값입니다.")
	private String nickname;

	@NotBlank(message = "전화번호는 필수 입력값입니다.")
	private String phoneNumber;
}
