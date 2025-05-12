// src/services/wishlistService.ts

import { Book } from "@/types/book";

// API URL - 실제 환경에서는 환경 변수로 관리
const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * 사용자의 위시리스트를 가져오는 함수
 */
export const getWishlist = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("위시리스트를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error("위시리스트 조회 오류:", error);
    throw error;
  }
};

/**
 * 위시리스트에 책을 추가하는 함수
 */
export const addToWishlist = async (
  bookId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/wishlist/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookId }),
    });

    if (!response.ok) {
      throw new Error("위시리스트에 추가하는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("위시리스트 추가 오류:", error);
    throw error;
  }
};

/**
 * 위시리스트에서 책을 제거하는 함수
 */
export const removeFromWishlist = async (
  bookIds: number[]
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/wishlist/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookIds }),
    });

    if (!response.ok) {
      throw new Error("위시리스트에서 제거하는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("위시리스트 제거 오류:", error);
    throw error;
  }
};

/**
 * 책이 위시리스트에 있는지 확인하는 함수
 */
export const checkInWishlist = async (bookId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/wishlist/check/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("위시리스트 확인에 실패했습니다.");
    }

    const data = await response.json();
    return data.inWishlist;
  } catch (error) {
    console.error("위시리스트 확인 오류:", error);
    return false;
  }
};
