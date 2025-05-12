package ninegle.Readio.mypage.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.mypage.dto.request.UserUpdateRequestDto;
import ninegle.Readio.mypage.dto.response.UserInfoDto;
import ninegle.Readio.mypage.service.MyPageUserService;

@RestController
@RequestMapping("/user/my")
@RequiredArgsConstructor
public class MyPageUserController {

	private final MyPageUserService myPageUserService;

	@GetMapping
	public ResponseEntity<BaseResponse<UserInfoDto>> getUserInfo() {
		UserInfoDto data = myPageUserService.getUserInfo();
		return BaseResponse.ok("회원 정보 조회 성공", data, HttpStatus.OK);
	}


	@PostMapping
	public ResponseEntity<BaseResponse<UserInfoDto>> updateUserInfo(@RequestBody UserUpdateRequestDto dto) {
		//닉네임, 전화번호 둘다 입력하지 않은 경우
		if ((dto.getNickname() == null || dto.getNickname().isBlank()) &&
			(dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank())) {
			// error는 BaseResponse<UserInfoDto>와 맞지 않기 때문에 강제 캐스팅
			return (ResponseEntity<BaseResponse<UserInfoDto>>) (ResponseEntity<?>)
				BaseResponse.error("필수 입력 항목을 입력해주세요.", HttpStatus.BAD_REQUEST);
		}

		UserInfoDto data = myPageUserService.updateUserInfo(dto);
		return BaseResponse.ok("회원 정보 수정 성공", data, HttpStatus.OK);
	}



}
