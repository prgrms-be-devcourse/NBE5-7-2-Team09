package ninegle.Readio.book.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
	Optional<Book> findByIdAndExpiredFalse(Long id);

	// 전체 페이지 조회
	Page<Book> findByExpiredFalse(Pageable pageable);
	// 특정 조회 페이지
	Page<Book> findByCategoryMajorAndExpiredFalse(String major, Pageable pageable);
}
