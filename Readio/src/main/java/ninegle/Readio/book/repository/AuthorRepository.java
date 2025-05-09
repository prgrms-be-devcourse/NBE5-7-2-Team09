package ninegle.Readio.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ninegle.Readio.book.domain.Author;

/**
 * Readio - AuthorRepository
 * create date:    25. 5. 9.
 * last update:    25. 5. 9.
 * author:  gigol
 * purpose: 
 */
public interface AuthorRepository extends JpaRepository<Author,Long> {
}
