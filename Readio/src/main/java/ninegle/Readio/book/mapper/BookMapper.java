package ninegle.Readio.book.mapper;

import java.util.ArrayList;
import java.util.List;

import ninegle.Readio.book.domain.Author;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.Category;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.AuthorDto;
import ninegle.Readio.book.dto.BookListResponseDto;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.dto.BookSearchResponseDto;
import ninegle.Readio.book.dto.CategoryDto;
import ninegle.Readio.book.dto.PaginationDto;
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

	public static Book toEntity (BookRequestDto dto, Publisher publisher,
		Author author, Category category, String epubUri) {
		return Book.builder()
			.name(dto.getName())
			.description(dto.getDescription())
			.image(dto.getImage())
			.isbn(dto.getIsbn())
			.ecn(dto.getEcn())
			.pubDate(dto.getPubDate())
			.epubUri(epubUri)
			.category(category)
			.publisher(publisher)
			.author(author)
			.build();
	}

	public static PaginationDto toPaginationDto(Long count,int page,int size){
		return PaginationDto.builder()
			.totalPages((count.intValue()/size)+1)
			.size(size)
			.currentPage(page)
			.totalElements(count)
			.build();
	}

	public static BookSearchResponseDto toSearchResponseDto(Book book) {
		return BookSearchResponseDto.builder()
			.id(book.getId())
			.name(book.getName())
			.image(book.getImage())
			.categoryMajor(book.getCategory().getMajor())
			.categorySub(book.getCategory().getSub())
			.authorName(book.getAuthor().getName())
			.build();
	}

	public static List<BookSearchResponseDto> toResponseDto(List<Book> books){
		ArrayList<BookSearchResponseDto> bookResponseDtos = new ArrayList<>();
		for (Book book : books) {
			bookResponseDtos.add(toSearchResponseDto(book));
		}
		return bookResponseDtos;
	}

	public static BookListResponseDto toBookListResponseDto(List<BookSearchResponseDto> bookList, PaginationDto paginationDto) {
		return BookListResponseDto.builder()
			.books(bookList)
			.pagination(paginationDto)
			.build();
	}

}
