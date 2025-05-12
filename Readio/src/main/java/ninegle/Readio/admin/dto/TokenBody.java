package ninegle.Readio.admin.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ninegle.Readio.admin.domain.Role;

@Getter
@RequiredArgsConstructor
public class TokenBody {
	private long userId;
	private String email;
	private Role role;

	public TokenBody(long userId, String email, Role role) {
		this.userId = userId;
		this.email = email;
		this.role = role;
	}
}
