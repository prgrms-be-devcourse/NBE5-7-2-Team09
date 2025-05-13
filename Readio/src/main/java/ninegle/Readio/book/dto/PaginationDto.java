package ninegle.Readio.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Readio - PaginationDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@AllArgsConstructor
public class PaginationDto {
	private long totalElements;
	private int totalPages;
	private int currentPage;
	private int size;
}