package ninegle.Readio.book.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.book.domain.BookSearch;

/**
 * Readio - BookSearchRepository
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose: 
 */
@Repository
<<<<<<< HEAD
public interface BookSearchRepository extends ElasticsearchRepository<BookSearch,Long> {
	List<BookSearch> findByTitleContainingOrPublisherContainingOrAuthorContaining(String title,String publisher,String author);
=======
public interface BookSearchRepository extends ElasticsearchRepository<BookEsDto, Long> {
	List<BookEsDto> findByTitleContainingOrPublisherContainingOrAuthorContaining(String title, String publisher,
		String author);
>>>>>>> refactor-dto
}
