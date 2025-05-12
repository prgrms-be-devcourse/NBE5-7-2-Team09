package ninegle.Readio.library.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import ninegle.Readio.book.domain.Book;

@Entity
//중간 테이블
public class LibraryBook {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne
	@JoinColumn(name = "book_id")
	private Book book;

	@ManyToOne
	@JoinColumn(name = "library_id")
	private Library library;
}
