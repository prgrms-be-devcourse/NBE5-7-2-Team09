package ninegle.Readio.book.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.book.domain.Author;
import ninegle.Readio.book.domain.Book;
import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.domain.Category;
import ninegle.Readio.book.domain.Publisher;
import ninegle.Readio.book.dto.BookRequestDto;
import ninegle.Readio.book.dto.BookResponseDto;
import ninegle.Readio.book.mapper.BookMapper;
import ninegle.Readio.book.mapper.BookSearchMapper;
import ninegle.Readio.book.repository.AuthorRepository;
import ninegle.Readio.book.repository.BookRepository;
import ninegle.Readio.book.repository.BookSearchRepository;
import ninegle.Readio.book.repository.CategoryRepository;
import ninegle.Readio.book.repository.PublisherRepository;
import ninegle.Readio.global.exception.BusinessException;
import ninegle.Readio.global.exception.domain.ErrorCode;
import ninegle.Readio.global.unit.BaseResponse;

/**
 * Readio - BookService
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose: 
 */
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;
	private final AuthorRepository authorRepository;
	private final CategoryRepository categoryRepository;
	private final PublisherRepository publisherRepository;
	private final BookSearchRepository bookSearchRepository;


	public List<BookSearch> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword, keyword);
	}

	public ResponseEntity<BaseResponse<?>> save(BookRequestDto request) {

		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		bookRepository.save(BookMapper.toEntity(request, publisher, author, category));
		// ElasticSearch Repository에 저장
		bookSearchRepository.save(BookSearchMapper.toEntity(request));

		return BaseResponse.ok("책 추가가 정상적으로 수행되었습니다.", HttpStatus.CREATED);
	}

	// 카테고리가 존재하면 Get, 존재하지 않다면 Throw 발생
	private Category getCategory(String categorySub) {
		return categoryRepository.findBySub(categorySub)
			.orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
	}

	// 작가가 존재하면 해당 작가를 Get, 존재하지 않다면 새로운 작가 생성 후 Get
	private Author getAuthor(String authorName) {
		return authorRepository.findByName(authorName)
			.orElseGet(() -> authorRepository.save(new Author(authorName)));
	}
	// 출판사가 존재하면 해당 출판사 Get, 존재하지 않다면 새로운 출판사 생성 후 Get
	private Publisher getPublisher(String publisherName) {
		return publisherRepository.findByName(publisherName)
			.orElseGet(() -> publisherRepository.save(new Publisher(publisherName)));
	}

	public ResponseEntity<BaseResponse<BookResponseDto>> getBookDetail(Long id) {

		Optional<Book> bookOptional = bookRepository.findById(id);
		if (bookOptional.isEmpty()) {
			throw new BusinessException(ErrorCode.BOOK_NOT_FOUND);
		}

		return BaseResponse.ok("정상적으로 조회가 완료되었습니다.", BookMapper.toDto(bookOptional.get()) ,HttpStatus.OK);
	}

	public ResponseEntity<BaseResponse<?>> updateBook(Long id, BookRequestDto request) {

		Book targetBook = bookRepository.findById(id)
			.orElseThrow(()->new BusinessException(ErrorCode.BOOK_NOT_FOUND));

		Category category = getCategory(request.getCategorySub());
		Author author = getAuthor(request.getAuthorName());
		Publisher publisher = getPublisher(request.getPublisherName());

		targetBook.update(request, category, author, publisher);

		return BaseResponse.ok("책 수정이 정상적으로 수행되었습니다.", HttpStatus.OK);
	}
}
