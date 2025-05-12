package ninegle.Readio.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.admin.domain.RefreshToken;

@Repository
public interface TokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByUserId(long adminId);
}
