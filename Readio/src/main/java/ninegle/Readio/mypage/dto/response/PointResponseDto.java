package ninegle.Readio.mypage.dto.response;

import lombok.Data;
import lombok.Getter;

@Getter
public class PointResponseDto {
	private final long currentPoint;

	public PointResponseDto(long currentPoint) {
		this.currentPoint = currentPoint;
	}
}