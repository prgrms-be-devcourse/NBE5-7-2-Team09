package ninegle.Readio.library.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ReadingProgress {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private long pageBNumber;

	private LocalDateTime readingDate;

}
