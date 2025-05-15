import axios from "axios";
import { BookDetailResponse, BookSearchResponse } from "@/types/book";
import preferenceService from "./preferenceService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 책 관련 서비스 API
export const bookService = {
  // 책 목록 조회 (검색, 카테고리 필터링 포함)
  getBooks: async (url: string) => {
    try {
      const response = await axios.get<BookSearchResponse>(
        `${API_BASE_URL}${url}`
      );
      console.log(`${API_BASE_URL}${url}`);
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
      console.log(`${API_BASE_URL}/books/${bookId}`);
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
  // bookService.ts에서 toggleWishlist 메서드 수정
  toggleWishlist: async (bookId: number | string) => {
    try {
      // preferenceService를 사용하여 관심도서 추가
      const response = await preferenceService.addToPreference(bookId);
      return response;
    } catch (error) {
      console.error("Error in toggleWishlist:", error);
      throw error;
    }
  },

  // 내 서재에 책 추가
  addToLibrary: async (bookId: number | string) => {
    try {
      // 1. 라이브러리가 없으면 "내 라이브러리1"이라는 이름으로 생성
      const librariesResponse = await axios.get(`${API_BASE_URL}/library`, {
        params: { page: 0, size: 1 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      let libraryId;

      // 라이브러리가 있는지 확인
      if (
        librariesResponse.data.data.allLibraries &&
        librariesResponse.data.data.allLibraries.length > 0
      ) {
        // 첫 번째 라이브러리 ID 사용
        libraryId = librariesResponse.data.data.allLibraries[0].id;
      } else {
        // 라이브러리가 없으면 생성
        const createResponse = await axios.post(
          `${API_BASE_URL}/library`,
          { libraryName: "내 라이브러리1" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        libraryId = createResponse.data.data.id;
      }

      // 2. 책 추가
      const response = await axios.post(
        `${API_BASE_URL}/library/${libraryId}`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in addToLibrary:", error);
      throw error;
    }
  },
};

export default bookService;
