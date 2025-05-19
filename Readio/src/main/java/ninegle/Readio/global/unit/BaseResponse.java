package ninegle.Readio.global.unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Builder
public class BaseResponse<T> {
    private final int status;
    private String message;
    private T data;

    // 이 코드는 곧 사라질 예정입니다.
    public static ResponseEntity<BaseResponse<?>> ok(String message,HttpStatus status) {
        return ResponseEntity.status(status)
                .body(new BaseResponse<>(status.value(), message, null));
    }

    // 모두 이 기반으로 바꾸면 위에 코드는 삭제 예정입니다.
    public static ResponseEntity<BaseResponse<?>> ok(HttpStatus status) {
        return ResponseEntity.status(status)
            .body(new BaseResponse<>(status.value(), null, null));
    }
    //성공 메시지와 데이터 반환
    public static <T> ResponseEntity<BaseResponse<T>> ok(String message,T data, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(new BaseResponse<>(status.value(), message, data));
    }
    //에러 메시지를 반환
    public static ResponseEntity<BaseResponse<?>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(new BaseResponse<>(status.value(), message, null));
    }
    //에러 메시지와 데이터를 반환
    public static <T> ResponseEntity<BaseResponse<T>> error(String message, T data, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(new BaseResponse<>(status.value(), message, data));
    }
}
