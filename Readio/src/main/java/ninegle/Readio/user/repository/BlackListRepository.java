package ninegle.Readio.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ninegle.Readio.user.domain.BlackList;

public interface BlackListRepository extends JpaRepository<BlackList, Long> {
	Optional<BlackList> findByInversionAccessToken(String token);

}
