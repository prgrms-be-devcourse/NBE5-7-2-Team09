package ninegle.Readio.book.mapper;

import java.math.BigDecimal;
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
			.image(book.getImage())
			.expired(false)
			.categoryMajor(book.getCategory().getMajor())
			.categorySub(book.getCategory().getSub())
			.author(book.getAuthor().getName())
			.rating(BigDecimal.ZERO)
			.build();
	}

	public static BookSearchResponseDto toDto(BookSearch bookSearch) {
		return BookSearchResponseDto.builder()
			.id(bookSearch.getId())
			.name(bookSearch.getName())
			.image(bookSearch.getImage())
			.categoryMajor(bookSearch.getCategoryMajor())
			.categorySub(bookSearch.getCategorySub())
			.authorName(bookSearch.getAuthor())
			.rating(bookSearch.getRating())
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
