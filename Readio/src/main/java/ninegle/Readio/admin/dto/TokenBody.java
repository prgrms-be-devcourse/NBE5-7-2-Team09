package ninegle.Readio.admin.dto;

import ninegle.Readio.admin.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TokenBody {
    private Long userId;
    private String email;
    private Role role;
}
