package ninegle.Readio.global.exception.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ErrorResponse {

	private final int status;
	private final String code;
	private final String message;
	private final String path;

	@Builder
	public ErrorResponse(int status, String code, String message, String path) {
		this.status = status;
		this.code = code;
		this.message = message;
		this.path = path;
	}

}
