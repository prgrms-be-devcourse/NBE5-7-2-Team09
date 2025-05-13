package ninegle.Readio.book.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ninegle.Readio.book.dto.BookEsDto;
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

	public List<BookEsDto> searchBooks(String keyword) {
		return bookSearchRepository.findByTitleContainingOrPublisherContainingOrAuthorContaining(keyword, keyword,
			keyword);
	}

	public BookEsDto save(BookEsDto book) {
		return bookSearchRepository.save(book);
	}
}
