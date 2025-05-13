package ninegle.Readio.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Readio - PaginationDto
 * create date:    25. 5. 12.
 * last update:    25. 5. 12.
 * author:  gigol
 * purpose: 
 */
@Getter
@Builder
@RequiredArgsConstructor
public class PaginationDto {
	private final long totalElements;
	private final int totalPages;
	private final int currentPage;
	private final int size;
}