import axios from "axios";
import { BookDetailResponse, BookSearchResponse } from "@/types/book";

const API_BASE_URL =
  import.meta.env.VITE_ENV_BASE_URL || "http://localhost:8080";

// 책 관련 서비스 API
export const bookService = {
  // 책 목록 조회 (검색, 카테고리 필터링 포함)
  getBooks: async (url: string) => {
    try {
      const response = await axios.get<BookSearchResponse>(
        `${API_BASE_URL}${url}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in getBooks:", error);
      throw error;
    }
  },

  // 책 상세 정보 조회 - API 응답 구조에 맞게 타입 추가
  getBookDetail: async (bookId: number | string) => {
    try {
      const response = await axios.get<BookDetailResponse>(
        `${API_BASE_URL}/books/${bookId}`
      );
      return response;
    } catch (error) {
      console.error("Error in getBookDetail:", error);
      throw error;
    }
  },

  // 책 리뷰 목록 조회
  getBookReviews: async (bookId: number | string, page = 1, size = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/books/${bookId}/reviews?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in getBookReviews:", error);
      throw error;
    }
  },

  // 책 리뷰 작성
  createBookReview: async (bookId: number | string, data: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/books/${bookId}/reviews`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error in createBookReview:", error);
      throw error;
    }
  },

  // 책 찜하기/찜 취소
  toggleWishlist: async (bookId: number | string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/books/${bookId}/wishlist`
      );
      return response.data;
    } catch (error) {
      console.error("Error in toggleWishlist:", error);
      throw error;
    }
  },

  // 내 서재에 책 추가
  addToLibrary: async (bookId: number | string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/library/books/${bookId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in addToLibrary:", error);
      throw error;
    }
  },
};

export default bookService;
