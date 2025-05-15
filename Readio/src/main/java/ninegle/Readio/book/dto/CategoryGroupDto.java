package ninegle.Readio.book.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
public class CategoryGroupDto {
	private long id;
	private String major;
	private List<String> subs;

	@Builder
	public CategoryGroupDto(long id, String major, List<String> subs) {
		this.id = id;
		this.major = major;
		this.subs = subs;
	}
}
