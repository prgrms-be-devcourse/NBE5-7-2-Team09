package ninegle.Readio.book.mapper;

import java.util.List;

import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookSearchResponseDto;

public class BookSearchMapper {


	public static BookSearch toEntity(Book book) {
		return BookSearch.builder()
			.id(book.getId())
			.name(book.getName())
			.description(book.getDescription())
			.image(book.getImage())
			.isbn(book.getIsbn())
			.ecn(book.getEcn())
			.pubDate(book.getPubDate())
			.expired(false)
			.categoryId(book.getCategory().getId())
			.categoryMajor(book.getCategory().getMajor())
			.categorySub(book.getCategory().getSub())
			.publisher(book.getPublisher().getName())
			.author(book.getAuthor().getName())
			.build();
	}

	public static BookSearchResponseDto toDto(BookSearch bookSearch) {
		return BookSearchResponseDto.builder()
			.id(bookSearch.getId())
			.name(bookSearch.getName())
			.description(bookSearch.getDescription())
			.image(bookSearch.getImage())
			.isbn(bookSearch.getIsbn())
			.ecn(bookSearch.getEcn())
			.pubDate(bookSearch.getPubDate())
			.categoryId(bookSearch.getCategoryId())
			.categoryMajor(bookSearch.getCategoryMajor())
			.categorySub(bookSearch.getCategorySub())
			.publisherName(bookSearch.getPublisher())
			.authorName(bookSearch.getAuthor())
			.build();
	}

	public static List<BookSearchResponseDto> toResponseDto(List<BookSearch> bookList) {
		List<BookSearchResponseDto> bookSearchResponseDtos = new java.util.ArrayList<>();
		for (BookSearch bookSearch : bookList) {
			bookSearchResponseDtos.add(toDto(bookSearch));
		}
		return bookSearchResponseDtos;
	}

}
