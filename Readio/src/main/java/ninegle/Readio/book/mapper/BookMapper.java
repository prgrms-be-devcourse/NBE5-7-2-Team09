package ninegle.Readio.book.mapper;

import ninegle.Readio.book.domain.Author;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.domain.Category;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.AuthorDto;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.dto.BookSearchResponseDto;
import ninegle.Readio.book.dto.CategoryDto;
import ninegle.Readio.book.dto.PublisherDto;

public class BookMapper {

	public static BookResponseDto toDto(Book book) {
		return BookResponseDto.builder()
			.id(book.getId())
			.name(book.getName())
			.description(book.getDescription())
			.image(book.getImage())
			.isbn(book.getIsbn())
			.ecn(book.getEcn())
			.pubDate(book.getPubDate())
			.category(toCategoryDto(book.getCategory()))
			.publisher(toPublisherDto(book.getPublisher()))
			.author(toAuthorDto(book.getAuthor()))
			.build();
	}

	public static CategoryDto toCategoryDto(Category category) {
		return CategoryDto.builder()
			.id(category.getId())
			.major(category.getMajor())
			.sub(category.getSub())
			.build();
	}

	public static PublisherDto toPublisherDto(Publisher publisher) {
		return PublisherDto.builder()
			.id(publisher.getId())
			.name(publisher.getName())
			.build();
	}

	public static AuthorDto toAuthorDto(Author author) {
		return AuthorDto.builder()
			.id(author.getId())
			.name(author.getName())
			.build();
	}

	public static Book toEntity (BookRequestDto dto, Publisher publisher, Author author, Category category) {
		return Book.builder()
			.name(dto.getName())
			.description(dto.getDescription())
			.image(dto.getImage())
			.isbn(dto.getIsbn())
			.ecn(dto.getEcn())
			.pubDate(dto.getPubDate())
			.category(category)
			.publisher(publisher)
			.author(author)
			.build();
	}



}
