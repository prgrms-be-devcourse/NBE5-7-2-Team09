package ninegle.Readio.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.library.domain.Library;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Integer> {

}
