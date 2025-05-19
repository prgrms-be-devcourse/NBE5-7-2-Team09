package ninegle.Readio.mypage.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public record UserInfoDto(String email, String nickname, String phoneNumber, long point) {
}
