package ninegle.Readio.book.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ninegle.Readio.book.dto.BookRequestDto;

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
@AllArgsConstructor // 얘 지우고 빌더 만들어주세요
@Builder
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 255)
	private String name;

	@Column(length = 1000, nullable = false)
	private String description;

	private String image;

	@Column(length = 20)
	private String isbn;

	@Column(length = 50)
	private String ecn;

	@Column(nullable = false)
	private LocalDate pubDate;

	private LocalDate updatedAt;

	private Boolean expired = false;

	private LocalDate expiredAt;

	@ManyToOne
	@JoinColumn(name = "author_id")
	private Author author;

	@ManyToOne
	@JoinColumn(name = "publisher_id")
	private Publisher publisher;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	public void update(BookRequestDto dto, Category category, Author author, Publisher publisher) {
		this.name = dto.getName();
		this.description = dto.getDescription();
		this.image = dto.getImage();
		this.isbn = dto.getIsbn();
		this.ecn = dto.getEcn();
		this.pubDate = dto.getPubDate();
		this.category = category;
		this.author = author;
		this.publisher = publisher;
	}

}

