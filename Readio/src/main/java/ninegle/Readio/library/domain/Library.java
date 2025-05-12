package ninegle.Readio.library.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ninegle.Readio.admin.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Library {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	private String libraryName;

	@CreatedDate
	private LocalDateTime created_at;

	@UpdateTimestamp
	private LocalDateTime updated_at;

	public Library(String libraryname, User user) {
		this.libraryName = libraryname;
		this.user = user;
	}

	//라이브러리 업데이트 용
	public void updateLibrary(String libraryname) {
		this.libraryName = libraryname;
	}

}
