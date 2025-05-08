package ninegle.Readio.admin.app;

import ninegle.Readio.admin.dto.UserDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

//알아서 admin 추출되게 만들어야 함

@Component
public class UserContextService {

    public Long getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Authentication이 null이거나, Principal이 AdminDetails가 아닌 경우 예외 처리
        if (auth == null || !(auth.getPrincipal() instanceof UserDetail)) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        UserDetail userDetail = (UserDetail) auth.getPrincipal();
        return userDetail.getId();  // 어드민 ID 반환
    }
}