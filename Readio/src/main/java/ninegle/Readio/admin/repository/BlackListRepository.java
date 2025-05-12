package ninegle.Readio.admin.repository;

import ninegle.Readio.admin.domain.BlackList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlackListRepository extends JpaRepository<BlackList, Long> {
    Optional<BlackList> findByInversionAccessToken(String token);

}
