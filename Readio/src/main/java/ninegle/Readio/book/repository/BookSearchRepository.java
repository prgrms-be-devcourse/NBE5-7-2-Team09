package ninegle.Readio.book.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import ninegle.Readio.book.dto.BookEsDto;

/**
 * Readio - BookSearchRepository
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose: 
 */
public interface BookSearchRepository extends ElasticsearchRepository<BookEsDto,Long> {
	List<BookEsDto> findByTitleContainingOrPublisherContainingOrAuthorContaining(String title,String publisher,String author);
}
