package ninegle.Readio.library.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ninegle.Readio.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Library {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	private String libraryName;

	//나 자신 즉 library 삭제하면 libraryBook도 삭제
	@OneToMany(mappedBy = "library", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<LibraryBook> libraryBook;

	@CreatedDate
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public Library(String libraryname, User user) {
		this.libraryName = libraryname;
		this.user = user;
	}

	public Library changeLibraryName(String newLibraryName) {
		this.libraryName = newLibraryName;
		return this;
	}

}
