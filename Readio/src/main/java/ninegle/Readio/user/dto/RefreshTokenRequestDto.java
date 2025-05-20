package ninegle.Readio.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshTokenRequestDto {
	@JsonProperty("refreshToken")
	@NotBlank(message = "refreshToken은 필수 입력값입나다.")
	private String refreshToken;
}
