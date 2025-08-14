import axios from "axios";
import { store } from "../store/store";
import { signInSuccess, logout } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://gopssl-backend.onrender.com";

// JWT 토큰을 자동으로 포함하는 axios 인스턴스
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신 함수
const refreshToken = async () => {
  try {
    const currentToken = store.getState().auth.token;

    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );

    const newToken = response.data.access_token;

    // Redux store 업데이트
    store.dispatch(
      signInSuccess({
        token: newToken,
        user: store.getState().auth.user,
      })
    );

    // AsyncStorage 업데이트
    await AsyncStorage.setItem("token", newToken);

    return newToken;
  } catch (error) {
    console.log("토큰 갱신 실패:", error.response?.status);
    // 토큰 갱신 실패 시 로그아웃
    store.dispatch(logout());
    throw error;
  }
};

// 요청 인터셉터: 매번 토큰을 가져와서 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        const newToken = await refreshToken();

        // 원래 요청을 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        console.log("토큰 갱신 실패");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
