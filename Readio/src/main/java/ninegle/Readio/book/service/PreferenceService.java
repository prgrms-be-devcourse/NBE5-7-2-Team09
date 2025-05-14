package ninegle.Readio.book.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import ninegle.Readio.book.dto.BookPreferenceDto;
import ninegle.Readio.book.dto.BookPreferenceListDto;
import ninegle.Readio.book.dto.PaginationDto;
import ninegle.Readio.book.mapper.PreferenceMapper;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.Preference;
import ninegle.Readio.book.dto.BookIdRequestDto;
import ninegle.Readio.book.repository.PreferencesRepository;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.user.domain.User;
import ninegle.Readio.user.service.UserContextService;
import ninegle.Readio.user.service.UserService;

/**
 * Readio - PreferenceService
 * create date:    25. 5. 13.
 * last update:    25. 5. 13.
 * author:  gigol
 * purpose: 
 */
@Service
@RequiredArgsConstructor
public class PreferenceService {

	private final PreferencesRepository preferencesRepository;
	private final PreferenceMapper preferenceMapper;
	private final BookService bookService;
	private final UserService userService;
	private final UserContextService userContextService;

	public Preference getPreferenceByBookAndUser(Book book,User user){
		return preferencesRepository.findByBookAndUser(book,user).getFirst();
	}


	public ResponseEntity<BaseResponse<Void>> save(BookIdRequestDto dto) {

		Book book =bookService.getBookById(dto.getId());
		User user = userService.getById(userContextService.getCurrentUserId());

		preferencesRepository.save(preferenceMapper.toEntity(user,book));
		return BaseResponse.ok("관심도서 추가가 정상적으로 수행되었습니다.", null,HttpStatus.CREATED);
	}

	public ResponseEntity<BaseResponse<Void>> delete(Long bookId) {
		Book book =bookService.getBookById(bookId);
		User user = userService.getById(userContextService.getCurrentUserId());
		Preference preference = getPreferenceByBookAndUser(book, user);

		preferencesRepository.delete(preference);
		return BaseResponse.ok("삭제가 성공적으로 수행되었습니다.",null,HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<BookPreferenceListDto>> getPreferenceList(int page, int size) {
		User user = userService.getById(userContextService.getCurrentUserId());
		Pageable pageable = PageRequest.of(page-1,size);
		long count = preferencesRepository.countByUser(user);

		List<Preference> preferences = preferencesRepository.findPreferencesByUser(user, pageable).getContent();
		List<BookPreferenceDto> preferenceList = preferenceMapper.toPreferenceDto(preferences);

		PaginationDto paginationDto = preferenceMapper.toPaginationDto(count, page, size);
		BookPreferenceListDto preferenceListDto = preferenceMapper.toPreferenceListDto(preferenceList, paginationDto);

		return BaseResponse.ok("관심도서 조회가 정상적으로 수행되었습니다.",preferenceListDto,HttpStatus.OK);
	}
}
