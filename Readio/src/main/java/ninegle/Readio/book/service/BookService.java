package ninegle.Readio.book.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ninegle.Readio.book.domain.BookSearch;
import ninegle.Readio.book.repository.BookSearchRepository;

/**
 * Readio - BookService
 * create date:    25. 5. 8.
 * last update:    25. 5. 8.
 * author:  gigol
 * purpose:
 */
@Service
public class BookService {
	private final BookSearchRepository bookSearchRepository;

	public BookService(BookSearchRepository bookSearchRepository) {
		this.bookSearchRepository = bookSearchRepository;
	}

<<<<<<< HEAD
	public List<BookSearch> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword, keyword);
=======
	public List<BookEsDto> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword,
			keyword);
>>>>>>> refactor-dto
	}

	public BookSearch save(BookSearch book) {
		return bookSearchRepository.save(book);
	}
}
