package ninegle.Readio.book.repository;

import java.util.List;
import java.util.Optional;

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
public interface BookSearchRepository extends ElasticsearchRepository<BookSearch, Long> {

	List<BookSearch> findByExpiredFalseAndNameContaining(String name);

	List<BookSearch> findByExpiredFalseAndPublisherContaining(String publisher);

	List<BookSearch> findByExpiredFalseAndAuthorContaining(String author);

	Optional<BookSearch> findById(Long id);
}