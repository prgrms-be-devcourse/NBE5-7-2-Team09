package ninegle.Readio.book.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import ninegle.Readio.book.dto.BookRequestDto;

/**
 * Readio - Book
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Getter
@Document(indexName = "books")
@Builder
public class BookSearch {

	@Id
	private Long id;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String name;
	private String description;
	private String image;
	private String isbn;
	private String ecn;

	@Field(type = FieldType.Date, format = DateFormat.basic_date)
	private LocalDate pubDate;

	private Boolean expired;

	private long categoryId;
	private String categoryMajor;
	private String categorySub;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String publisher;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String author;

	public void softDelete() {
		this.expired = true;
	}

	public BookSearch update(BookRequestDto dto, Category category, Author author, Publisher publisher) {
		this.name = dto.getName();
		this.description = dto.getDescription();
		this.image = dto.getImage();
		this.isbn = dto.getIsbn();
		this.ecn = dto.getEcn();
		this.pubDate = dto.getPubDate();
		this.categoryId = category.getId();
		this.categoryMajor = category.getMajor();
		this.categorySub = category.getSub();
		this.publisher = publisher.getName();
		this.author = author.getName();

		return this;
	}

	// 중복 제거를 위해 Override
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		BookSearch that = (BookSearch) o;
		return Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

}
