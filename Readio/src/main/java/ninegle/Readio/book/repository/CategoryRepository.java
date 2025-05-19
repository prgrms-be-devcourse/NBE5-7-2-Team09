package ninegle.Readio.book.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ninegle.Readio.book.domain.Category;

public interface CategoryRepository extends JpaRepository<Category,Long> {

	Optional<Category> findBySub(String sub);
}
