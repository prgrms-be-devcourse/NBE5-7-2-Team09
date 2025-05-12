package ninegle.Readio.mypage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.admin.domain.User;
import ninegle.Readio.admin.repository.UserRepository;
import ninegle.Readio.admin.service.UserContextService;
import ninegle.Readio.mypage.dto.request.UserUpdateRequestDto;
import ninegle.Readio.mypage.dto.response.UserInfoDto;
import ninegle.Readio.mypage.mapper.MyPageUserMapper;

@Service
@RequiredArgsConstructor
public class MyPageUserService {

	private final UserContextService userContextService;
	private final UserRepository userRepository;

	public UserInfoDto getUserInfo() {
		// 인증된 사용자 ID 확인
		Long userId = userContextService.getCurrentAdminId();

		// 해당 사용자 조회
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

		// User 객체를 UserInfoDto로 변환하여 반환
		return MyPageUserMapper.toUserInfoDto(user);
	}

	@Transactional
	public UserInfoDto updateUserInfo(UserUpdateRequestDto dto) {
		Long userId = userContextService.getCurrentAdminId();
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

		// nickname 수정
		if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
			user.setNickname(dto.getNickname()); // nickname 직접 수정
		}

		// phone number 수정
		if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
			user.setPhoneNumber(dto.getPhoneNumber()); // phone number 직접 수정
		}

		// 수정된 User를 반환
		return MyPageUserMapper.toUserInfoDto(user);
	}
}

