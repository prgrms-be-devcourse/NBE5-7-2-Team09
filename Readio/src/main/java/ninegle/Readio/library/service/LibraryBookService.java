package ninegle.Readio.library.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.repository.BookRepository;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.library.domain.Library;
import ninegle.Readio.library.domain.LibraryBook;
import ninegle.Readio.library.dto.book.NewLibraryBookRequestDto;
import ninegle.Readio.library.mapper.LibraryBookMapper;
import ninegle.Readio.library.repository.LibraryBookRepository;
import ninegle.Readio.library.repository.LibraryRepository;

@Service
@RequiredArgsConstructor
public class LibraryBookService {
	private final BookRepository bookRepository;
	private final LibraryRepository libraryRepository;
	private final LibraryBookRepository libraryBookRepository;

	//라이브러리에 책 저장
	public ResponseEntity<BaseResponse<?>> newLibraryBook(Long libraryId, NewLibraryBookRequestDto bookRequestDto) {

		//라이브러리 가져오기
		Optional<Library> libraryOptional = libraryRepository.findById(libraryId);
		if (libraryOptional.isEmpty()) {
			BaseResponse.error("라이브러리가 존재하지 않습니다", HttpStatus.BAD_REQUEST);
		}
		Library library = libraryOptional.get();

		//라이브러리에 추가할 책
		Long newLibraryBookId = LibraryBookMapper.toNewLibraryBook(bookRequestDto);
		Optional<Book> findBook = bookRepository.findById(newLibraryBookId);
		if (findBook.isEmpty()) {
			BaseResponse.error("책이 존재하지 않습니다", HttpStatus.BAD_REQUEST);
		}
		Book book = findBook.get();

		LibraryBook libraryBook = LibraryBook.builder()
			.book(book)
			.library(library).build();

		libraryBookRepository.save(libraryBook);

		return BaseResponse.ok("읽고 있는 책이 추가되었습니다", HttpStatus.OK);
	}

	// //라이브러리에 책들 불러오기
	// public ResponseEntity<BaseResponse<?>> getAllLibraryBooks(Pageable pageable) {
	//
	// }

}
