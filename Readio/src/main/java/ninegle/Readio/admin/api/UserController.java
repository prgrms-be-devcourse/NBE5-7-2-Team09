package ninegle.Readio.admin.api;
import ninegle.Readio.admin.app.UserService;
import ninegle.Readio.admin.dto.LoginRequestDto;
import ninegle.Readio.admin.dto.RefreshTokenRequestDto;
import ninegle.Readio.admin.dto.SingUpRequestDto;
import ninegle.Readio.global.unit.BaseResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/user/signup")
    public ResponseEntity<BaseResponse<?>> signup(@RequestBody SingUpRequestDto signUpRequestDto) {
        return userService.signup(signUpRequestDto);
    }


    //반환으로 헤더에 토큰값을 넣어줘야 하니깐 HttpServletResponse
    @PostMapping("/user/login")
    public ResponseEntity<BaseResponse<?>> login(@RequestBody LoginRequestDto loginRequestDto , HttpServletResponse response) {
        return userService.login(loginRequestDto, response);

    }

    //https로 사용한다 가정하에 body값으로 refresh token을 전송
    @PostMapping("/user/logout")
    public ResponseEntity<BaseResponse<?>> logout(@RequestHeader("Authorization") String accessToken, @RequestBody RefreshTokenRequestDto refreshTokenRequestDto) {
        return userService.logout(accessToken, refreshTokenRequestDto);
    }



    //프론트에서 access token 만료로 인해 재발급을 요청함 (본인이 가진 refresh token을 가지고 요청합니다)
    @PostMapping("/user/reissue-token")
    public ResponseEntity<BaseResponse<?>> reissueToken(@RequestHeader("Authorization") String refreshToken, HttpServletResponse response) {
        return userService.reissue(refreshToken, response);
    }

}
