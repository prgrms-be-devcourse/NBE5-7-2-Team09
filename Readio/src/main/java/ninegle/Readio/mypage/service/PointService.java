package ninegle.Readio.mypage.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.admin.domain.User;
import ninegle.Readio.admin.repository.UserRepository;
import ninegle.Readio.admin.service.UserContextService;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
public class PointService {

	private final UserContextService userContextService;
	private final UserRepository userRepository;

	public long getUserPoints() {
		Long userId = userContextService.getCurrentAdminId();

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(ErrorCode.AUTHENTICATION_REQUIRED));

		return user.getPoint();
	}
}