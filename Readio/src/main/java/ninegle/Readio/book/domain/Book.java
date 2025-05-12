package ninegle.Readio.book.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Readio - Book
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose: 
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "book")
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false, length = 255)
	private String name;

	@Column(length = 1000)
	private String description;

	private String image;

	private Integer page;

	@Column(length = 20, unique = true)
	private String isbn;

	@Column(length = 50)
	private String ecn;

	private LocalDateTime pubDate;

	private LocalDateTime updatedAt;

	private boolean deleted;

	private LocalDateTime deletedAt;

	@ManyToOne
	@JoinColumn(name = "author_id")
	private Author author;

	@ManyToOne
	@JoinColumn(name = "publisher_id")
	private Publisher publisher;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	@Builder
	public Book(String name, String description, String image, Integer page, String isbn, String ecn,
		LocalDateTime pubDate,
		LocalDateTime updatedAt, boolean deleted, LocalDateTime deletedAt, Author author, Publisher publisher,
		Category category) {
		this.name = name;
		this.description = description;
		this.image = image;
		this.page = page;
		this.isbn = isbn;
		this.ecn = ecn;
		this.pubDate = pubDate;
		this.updatedAt = updatedAt;
		this.deleted = deleted; //soft delete
		this.deletedAt = deletedAt;
		this.author = author;
		this.publisher = publisher;
		this.category = category;
	}
}
