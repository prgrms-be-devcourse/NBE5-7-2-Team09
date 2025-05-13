package ninegle.Readio.book.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.book.domain.Book;

/**
 * Readio - BookRepository
 * create date:    25. 5. 9.
 * last update:    25. 5. 9.
 * author:  gigol
 * purpose: 
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	Optional<Book> findById(Long id);
}
