package ninegle.Readio.book.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.Preference;
import ninegle.Readio.book.dto.BookPreferenceDto;
import ninegle.Readio.book.dto.BookPreferenceListDto;
import ninegle.Readio.book.dto.PaginationDto;
import ninegle.Readio.user.domain.User;

/**
 * Readio - PreferenceMapper
 * create date:    25. 5. 13.
 * last update:    25. 5. 13.
 * author:  gigol
 * purpose: 
 */
@Component
public class PreferenceMapper {
	public Preference toEntity(User user, Book book){
		return Preference.builder()
			.user(user)
			.book(book)
			.build();
	}
	public BookPreferenceDto toPreferenceDto(Preference preference){

		return BookPreferenceDto.builder()
			.id(preference.getBook().getId())
			.name(preference.getBook().getName())
			.image(preference.getBook().getImage())
			.build();
	}
	public List<BookPreferenceDto> toPreferenceDto(List<Preference> preferences){
		List<BookPreferenceDto> bookPreferenceDtos = new ArrayList<>();
		for (Preference preference : preferences) {
			bookPreferenceDtos.add(toPreferenceDto(preference));
		}
		return bookPreferenceDtos;
	}
	public BookPreferenceListDto toPreferenceListDto(List<BookPreferenceDto> bookPreferenceDtos, PaginationDto paginationDto){
		return BookPreferenceListDto.builder()
			.preferences(bookPreferenceDtos)
			.pagination(paginationDto)
			.build();
	}
	public PaginationDto toPaginationDto(Long count,int page,int size){
		return PaginationDto.builder()
			.totalPages((count.intValue()/size)+1)
			.size(size)
			.currentPage(page)
			.totalElements(count)
			.build();
	}
}
