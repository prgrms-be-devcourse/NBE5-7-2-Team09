package ninegle.Readio.admin.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String refreshToken;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    //단방향으로 어드민과 연결
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();



    @Builder
    public RefreshToken(String refreshToken, User user) {
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public void newSetRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        this.createdAt = LocalDateTime.now(); // 갱신 시간 업데이트 (옵션)
    }
}
