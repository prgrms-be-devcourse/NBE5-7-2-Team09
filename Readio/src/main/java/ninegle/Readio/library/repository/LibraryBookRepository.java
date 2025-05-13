package ninegle.Readio.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.library.domain.LibraryBook;

@Repository
public interface LibraryBookRepository extends JpaRepository<LibraryBook, Long> {

}
