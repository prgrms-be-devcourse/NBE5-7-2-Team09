import api from "./axiosConfig";
import { Admin } from "@/interface/Admin";

interface AdminLoginForm {
  email: string;
  password: string;
}

export const adminAuthService = {
  login: async (credentials: AdminLoginForm) => {
    // 실제 구현에서는 아래와 같이 API 요청을 보냅니다
    // const response = await api.post("/admin/login", credentials);

    // 테스트를 위한 모의 응답 데이터
    const mockResponse = {
      headers: {
        authorization: "Bearer mock-admin-access-token",
        refresh: "mock-admin-refresh-token",
      },
      data: {
        admin: {
          id: "admin-1",
          email: credentials.email,
          name: "관리자",
          role: "ADMIN",
        },
      },
    };

    // 검증: 이메일이 admin@example.com이고 비밀번호가 adminpassword인 경우만 로그인 성공
    if (
      credentials.email === "admin@example.com" &&
      credentials.password === "adminpassword"
    ) {
      const accessToken = mockResponse.headers.authorization;
      const refreshToken = mockResponse.headers.refresh;

      return {
        accessToken: accessToken.replace("Bearer ", ""),
        refreshToken,
        admin: mockResponse.data.admin,
      };
    } else {
      // 로그인 실패 시 오류 발생
      throw new Error(
        "관리자 로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요."
      );
    }
  },

  logout: async () => {
    try {
      const accessToken = localStorage.getItem("adminAccessToken");
      const refreshToken = localStorage.getItem("adminRefreshToken");

      if (!accessToken || !refreshToken) {
        console.warn("로그아웃 시 토큰이 없습니다.");
        return { success: true };
      }

      // 실제 구현에서는 아래와 같이 API 요청을 보냅니다
      // const response = await api.post(
      //   "/admin/logout",
      //   { refreshToken },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );

      // 테스트 환경에서는 성공 응답을 반환합니다
      return { success: true };
    } catch (error) {
      console.error("관리자 로그아웃 에러:", error);
      throw error;
    }
  },

  // 테스트 목적으로 간단한 토큰 검증 함수 추가
  validateToken: () => {
    const token = localStorage.getItem("adminAccessToken");
    return !!token; // 토큰이 존재하면 유효하다고 가정
  },
};
