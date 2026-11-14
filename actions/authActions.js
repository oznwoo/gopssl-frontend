import { apiClient, BASE_URL } from "../constants/baseURL";
import {
  signUpSuccess,
  signInSuccess,
  logout as logoutAction,
  registerSuccess,
} from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken, removeToken } from "../utils/tokenStorage";
import { getAllCustomer, CUSTOMER_CACHE_KEY } from "./customerActions";
import { setCustomers } from "../store/customerSlice";
import { store } from "../store/store";
import axios from "axios";

// 토큰 갱신 액션
export const refreshToken = () => {
  return async (dispatch) => {
    try {
      const response = await apiClient.post(`/auth/refresh`);
      const newToken = response.data.access_token;

      // Redux store 업데이트
      dispatch(
        signInSuccess({
          token: newToken,
          user: store.getState().auth.user,
        })
      );

      // SecureStore 업데이트
      await setToken(newToken);

      return newToken;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      // 토큰 갱신 실패 시 로그아웃
      dispatch(logoutAction());
      throw error;
    }
  };
};

export const registerUserInfo = ({
  id,
  name,
  email,
  password,
  store_name,
  address,
  zip_code,
  address_detail,
}) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.put(`/users/${id}`, {
        name,
        email,
        password,
        store_name,
        address,
        zip_code,
        address_detail,
      });

      const user = response.data;

      dispatch(registerSuccess({ user }));

      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      let errorMessage = "회원 정보 입력에 실패했습니다.";
      let statusCode = null;

      if (e.response) {
        const { status, data } = e.response;
        statusCode = status;

        if (status === 400 && typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (status === 422 && Array.isArray(data.detail)) {
          errorMessage = data.detail[0]?.msg || errorMessage;
        }
      }

      const customError = new Error(errorMessage);
      customError.status = statusCode; // ✅ 상태코드 추가
      throw customError;
    }
  };
};

// 회원가입 액션
export const signUp = ({ name, email, password }) => {
  return async (dispatch) => {
    try {
      // 회원가입은 인증이 필요하지 않으므로 일반 axios 사용
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      const token = response.data.access_token;

      // 먼저 토큰을 Redux store에 저장
      dispatch(signUpSuccess({ token, user: null }));
      dispatch(getAllCustomer());
      await setToken(token);

      // 토큰을 직접 헤더에 포함시켜서 사용자 정보 요청
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const userRes = await axios.get(`${BASE_URL}/users/me`, { headers });
      const user = userRes.data;

      // 사용자 정보로 Redux store 업데이트
      dispatch(signUpSuccess({ token, user }));
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      console.log("회원가입 에러 전체:", e);
      console.log("에러 응답:", e.response);
      if (e.response) {
        console.log("에러 응답 헤더:", e.response.headers);
        console.log("에러 응답 상태:", e.response.status);
        console.log("에러 응답 상태 텍스트:", e.response.statusText);
      }

      let errorMessage = "회원가입에 실패했습니다.";
      let statusCode = null;

      if (e.response) {
        const { status, data } = e.response;
        console.log("에러 상태:", status);
        console.log("에러 데이터:", data);

        statusCode = status;

        if (status === 400 && typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (status === 422 && Array.isArray(data.detail)) {
          errorMessage = data.detail[0]?.msg || errorMessage;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      const customError = new Error(errorMessage);
      customError.status = statusCode;
      throw customError;
    }
  };
};

export const signIn = ({ email, password, rememberMe }) => {
  return async (dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      // 로그인은 인증이 필요하지 않으므로 일반 axios 사용
      const response = await axios.post(`${BASE_URL}/auth/signin`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;

      // 토큰을 직접 헤더에 포함시켜서 사용자 정보 요청
      const userRes = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userRes.data;

      // 토큰과 사용자 정보를 한 번에 Redux store에 저장
      dispatch(signInSuccess({ token, user }));
      dispatch(getAllCustomer());

      if (rememberMe) {
        await setToken(token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await removeToken();
        await AsyncStorage.removeItem("user");
      }
    } catch (e) {
      let errorMessage =
        "로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.";
      let statusCode = null;

      if (e.response) {
        const { status, data } = e.response;

        statusCode = status;

        if (status === 400 && typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (status === 422 && Array.isArray(data.detail)) {
          errorMessage = data.detail[0]?.msg || errorMessage;
        }
      }

      const customError = new Error(errorMessage);
      customError.status = statusCode;
      throw customError;
    }
  };
};

// 기기에 남은 로그인 흔적(토큰·가게 정보·고객 캐시·리포트 날짜)을 지우고 Redux를 로그아웃 상태로 만든다.
// 로그아웃과 회원 탈퇴가 같이 쓴다. 한 항목 삭제가 실패해도 나머지는 계속 지우고,
// 화면은 항상 로그인 화면으로 보낸다 (탈퇴한 계정 화면에 갇히지 않도록).
// @viewedOnboarding은 유지 (재로그인 시 온보딩 재표시 불필요)
const clearLocalSession = async (dispatch) => {
  const userId = store.getState().auth.user?.id;
  const storageKeys = ["user", CUSTOMER_CACHE_KEY];
  if (userId) storageKeys.push(`@lastReportDate_${userId}`);

  const results = await Promise.allSettled([
    removeToken(),
    AsyncStorage.multiRemove(storageKeys),
  ]);
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => console.error("로컬 세션 정리 중 오류:", r.reason));

  dispatch(setCustomers([]));
  dispatch(logoutAction());
};

export const logout = () => {
  return async (dispatch) => {
    await clearLocalSession(dispatch);
  };
};

// 회원 탈퇴: 서버 계정 삭제(손님·매출 등은 서버에서 CASCADE 삭제)가 성공한 뒤에만 로컬을 정리한다.
// 실패하면 에러를 던지고 로그인 상태는 그대로 둔다.
const USER_NOT_FOUND_DETAIL = "사용자가 존재하지 않습니다.";

export const deleteAccount = () => {
  return async (dispatch) => {
    try {
      await apiClient.delete("/users/me");
    } catch (e) {
      // 서버에 이미 계정이 없음 (예: 이전 요청은 삭제됐는데 응답만 못 받은 경우) → 탈퇴 완료로 본다.
      // 백엔드 get_current_user의 404 문구로만 판단한다 (주소 오류 등 다른 404는 실패로 처리)
      const alreadyDeleted =
        e.response?.status === 404 &&
        e.response?.data?.detail === USER_NOT_FOUND_DETAIL;
      if (!alreadyDeleted) {
        const customError = new Error(
          "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        customError.status = e.response?.status ?? null;
        throw customError;
      }
    }

    await clearLocalSession(dispatch);
  };
};
