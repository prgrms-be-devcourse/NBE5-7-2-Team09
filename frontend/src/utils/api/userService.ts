// src/services/userService.ts

import { UserProfile, ProfileUpdateRequest, Subscription } from "@/types/user";

// API URL - 실제 환경에서는 환경 변수로 관리
const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * 사용자 프로필 정보를 가져오는 함수
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("프로필을 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error("사용자 프로필 조회 오류:", error);
    // 오류 발생 시 기본 정보 반환 (실제 환경에서는 오류 처리를 개선해야 함)
    return {
      nickname: "게스트",
      email: "guest@example.com",
      phoneNumber: "",
      points: 0,
    };
  }
};

/**
 * 사용자 프로필 정보를 업데이트하는 함수
 */
export const updateUserProfile = async (
  profileData: ProfileUpdateRequest
): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("프로필 업데이트에 실패했습니다.");
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error("사용자 프로필 업데이트 오류:", error);
    throw error;
  }
};

/**
 * 사용자 구독 정보를 가져오는 함수
 */
export const getUserSubscription = async (): Promise<Subscription> => {
  try {
    const response = await fetch(`${API_URL}/user/subscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("구독 정보를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return data.subscription;
  } catch (error) {
    console.error("구독 정보 조회 오류:", error);
    // 오류 발생 시 기본 정보 반환 (실제 환경에서는 오류 처리를 개선해야 함)
    return {
      isActive: false,
    };
  }
};

/**
 * 구독을 시작하는 함수
 */
export const startSubscription = async (
  planId: string
): Promise<Subscription> => {
  try {
    const response = await fetch(`${API_URL}/subscription/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      throw new Error("구독 시작에 실패했습니다.");
    }

    const data = await response.json();
    return data.subscription;
  } catch (error) {
    console.error("구독 시작 오류:", error);
    throw error;
  }
};

/**
 * 구독을 취소하는 함수
 */
export const cancelSubscription = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/subscription/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("구독 취소에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("구독 취소 오류:", error);
    throw error;
  }
};
