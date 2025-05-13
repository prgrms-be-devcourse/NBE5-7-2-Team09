package ninegle.Readio.admin.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

	@Id
	@Column(name = "user_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 40, nullable = false)
	private String email;

	@Column(length = 100, nullable = false)
	private String password;

	private Role role = Role.USER;

	private String nickname;

	private String phone_number;

	private int point = 50000;

	@Builder
	public User(String email, String password, String nickname, String phonenumber, int point) {
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.phone_number = phonenumber;
		this.point = point;
	}

}
