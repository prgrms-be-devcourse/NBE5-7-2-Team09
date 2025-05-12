package ninegle.Readio.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ninegle.Readio.admin.domain.BlackList;

public interface BlackListRepository extends JpaRepository<BlackList, Long> {
	Optional<BlackList> findByInversionAccessToken(String token);

}
