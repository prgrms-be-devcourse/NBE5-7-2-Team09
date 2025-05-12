// src/types/book.ts

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  category: string;
  rating?: number;
  publishDate?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  addedDate?: string; // 위시리스트에 추가된 날짜
  description?: string;
  isbn?: string;
  pageCount?: number;
  publisher?: string;
  price?: number;
}

export interface BookCategory {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface BookSearchParams {
  query?: string;
  category?: string;
  sortBy?:
    | "newest"
    | "oldest"
    | "title_asc"
    | "title_desc"
    | "rating_high"
    | "rating_low";
  page?: number;
  limit?: number;
}

export interface BookSearchResponse {
  books: Book[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
