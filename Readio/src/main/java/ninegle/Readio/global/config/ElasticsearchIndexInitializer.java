package ninegle.Readio.global.config;

import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.dto.BookEsDto;

/**
 * Readio - ElasticsearchIndexInitializer
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Component
@RequiredArgsConstructor
public class ElasticsearchIndexInitializer {

	private final ElasticsearchOperations operations;

	@PostConstruct
	public void createIndex() {
		if (!operations.indexOps(BookEsDto.class).exists()) {
			operations.indexOps(BookEsDto.class).create();
			operations.indexOps(BookEsDto.class).putMapping(operations.indexOps(BookEsDto.class).createMapping());
		}
	}
}