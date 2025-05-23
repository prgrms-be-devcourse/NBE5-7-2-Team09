package ninegle.Readio.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.user.domain.RefreshToken;

@Repository
public interface TokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findTop1ByUserIdOrderByIdDesc(long adminId);

	List<RefreshToken> findAllByUserId(long adminId);
}
