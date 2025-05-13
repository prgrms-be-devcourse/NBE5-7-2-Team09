package ninegle.Readio.book.domain;

import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * Readio - Book
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Getter
@Document(indexName = "books")
@ToString
public class BookSearch {
	@Id
	private String id;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String title;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String publisher;

	@Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
	private String author;

	@Builder
	public BookSearch(String title, String publisher, String author) {
		this.id = UUID.randomUUID().toString();
		this.title = title;
		this.publisher = publisher;
		this.author = author;
	}
}
