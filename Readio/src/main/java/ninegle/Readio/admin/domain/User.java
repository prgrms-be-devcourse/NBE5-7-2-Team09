package ninegle.Readio.admin.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class User {

    @Id
    @Column(name="user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=40, nullable=false)
    private String email;

    @Column(length=100, nullable=false)
    private String password;

    private Role role  = Role.USER;

    private String nickname;

    private String phoneNumber;

    private int point = 50000;

    @Builder
    public User(String email, String password, String nickname, String phoneNumber, int point) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.point = point > 0 ? point : 50000; //point가 0일때 기본값을 사용하도록 구현!
    }

    // 닉네임 변경 메서드
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    // 핸드폰번호 변경 메서드
    public void updatePhoneNumber(String phone_number) {
        this.phoneNumber = phone_number;
    }

    // point 수정할 수 있도록 setter 추가
    public void setPoint(int point) {
        this.point = point;
    }

}
