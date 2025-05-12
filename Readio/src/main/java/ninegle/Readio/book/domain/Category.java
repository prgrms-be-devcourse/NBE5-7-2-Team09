package ninegle.Readio.book.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Readio - category
 * create date:    25. 5. 9.
 * last update:    25. 5. 9.
 * author:  gigol
 * purpose: 
 */

@Getter
@Entity
@Table(name="category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

	@Id
	private Long id;

	private String major;

	private String sub;
}
