package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class CategoryGroupResponseDto {
	private List<CategoryGroupDto> categories;

	public CategoryGroupResponseDto(List<CategoryGroupDto> categories) {
		this.categories = categories;
	}
}
