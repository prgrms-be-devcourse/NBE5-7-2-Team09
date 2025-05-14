package ninegle.Readio.global.exception.domain;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

	/*
	 * Commons : 공통 예외 처리
	 */
	// 400
	INVALID_REQUEST_DATA(HttpStatus.BAD_REQUEST, "요청 데이터가 올바르지 않습니다. 입력 데이터를 확인해 주세요."),
	INVALID_PAGINATION_PARAMETER(HttpStatus.BAD_REQUEST,
		"요청 파라미터가 유효하지 않습니다. page는 1 이상, size는 1 이상 50 이하로 설정 해야 합니다."),

	// 401
	AUTHENTICATION_REQUIRED(HttpStatus.UNAUTHORIZED, "인증이 필요한 요청입니다. 로그인 해주세요."),

	// 404
	BOOK_NOT_FOUND(HttpStatus.NOT_FOUND,"해당 책을 찾을 수 없습니다."),
	CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 카테고리를 찾을 수 없습니다."),


	// 500
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "예기치 못한 오류가 발생했습니다."),

	/*
	 * Books : 책 예외 처리
	 */
	// 400
	INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "올바르지 않는 파일 형식 입니다."),

	// 409
	BOOK_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 등록된 책입니다."),
	DUPLICATE_ISBN(HttpStatus.CONFLICT, "이미 등록된 ISBN입니다."),
	DUPLICATE_ECN(HttpStatus.CONFLICT, "이미 등록된 ECN입니다."),
	DUPLICATE_NAME(HttpStatus.CONFLICT, "이미 존재하는 이름입니다."),

	/*
	 * Library : 라이브러리 예외 처리
	 */
	// 400
	NEGATIVE_PAGE_NUMBER(HttpStatus.BAD_REQUEST, "페이지 수는 음수일 수 없습니다."),

	// 404
	BOOK_READ_HISTORY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 책 열람 기록을 찾을 수 없습니다."),
	LIBRARY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 라이브러리를 찾을 수 없습니다."),

	// 409
	LIBRAY_NAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 라이브러리명입니다."),
	BOOK_ALREADY_IN_READING_LIST(HttpStatus.CONFLICT, "이미 읽고 있는 책 목록에 존재합니다."),

	/*
	 * Preference : 관심 도서 예외 처리
	 */
	BOOK_ALREADY_IN_PREFERENCE(HttpStatus.CONFLICT, "이미 관심 도서로 등록된 책입니다."),

	/*
	 * Subscription : 구독 예외 처리
	 */
	// 400
	INVALID_EMAIL_FORMAT(HttpStatus.BAD_REQUEST, "이메일 형식이 올바르지 않습니다."),
	MISSING_REQUIRED_FIELD(HttpStatus.BAD_REQUEST, "필수 입력 항목을 입력해 주세요."),

	// 404
	SUBSCRIPTION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 구독입니다."),
	USER_SUBSCRIPTIONS_EMPTY(HttpStatus.NOT_FOUND, "사용자의 구독 내역이 존재하지 않습니다."),

	/*
	 * Viewer : 뷰어 예외 처리
	 */
	// 403
	FORBIDDEN_BOOK_ACCESS(HttpStatus.FORBIDDEN, "이 책에 대한 열람 권한이 없습니다."),

	// 404
	PUBLISHER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 출판사를 찾을 수 없습니다."),

	// 409
	PUBLISHER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 출판사입니다."),

	/*
	 * mypage : 관련 예외 처리
	 */
	//400
	ALREADY_SUBSCRIBED(HttpStatus.BAD_REQUEST, "이미 구독중인 구독권이 있습니다."),
	//400
	NOT_ENOUGH_POINTS(HttpStatus.BAD_REQUEST, "보유 포인트가 부족합니다."),
	//404
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	//400
	SUBSCRIPTION_CANCELED(HttpStatus.BAD_REQUEST, "이미 취소된 구독입니다."),
	;



	private final HttpStatus status;
	private final String message;

	ErrorCode(HttpStatus status, String message) {
		this.status = status;
		this.message = message;
	}

}
