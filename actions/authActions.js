import { apiClient, BASE_URL } from "../constants/baseURL";
import {
  signUpSuccess,
  signInSuccess,
  logout as logoutAction,
} from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken, removeToken } from "../utils/tokenStorage";
import { getAllCustomer, CUSTOMER_CACHE_KEY } from "./customerActions";
import { setCustomers } from "../store/customerSlice";
import { store } from "../store/store";
import axios from "axios";
import { TERMS_VERSION, PRIVACY_VERSION } from "../constants/legal";

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

// 서버(UserCreate) 필드 → 가입 폼 필드
const SIGNUP_FIELD_MAP = {
  name: "name",
  email: "email",
  password: "password",
  agree_terms: "agreeTerms",
  agree_privacy: "agreePrivacy",
  agree_over_14: "agreeOver14",
  // 버전 누락은 사용자가 고칠 수 없는 앱 문제라 약관 칸에 표시만 한다
  terms_version: "agreeTerms",
  privacy_version: "agreePrivacy",
};

// FastAPI 422 detail([{ loc: ["body", "password"], msg: "Value error, ..." }])을
// { password: "..." } 형태의 칸별 에러로 바꾼다. 같은 칸은 첫 메시지만 쓴다.
const toSignUpFieldErrors = (detail) => {
  const fieldErrors = {};
  detail.forEach((item) => {
    const field = SIGNUP_FIELD_MAP[item?.loc?.[1]];
    if (!field || fieldErrors[field]) return;
    fieldErrors[field] = String(item.msg || "").replace(/^Value error, /, "");
  });
  return fieldErrors;
};

// 회원가입 액션
// passwordConfirm은 화면에서만 쓰고 서버로 보내지 않는다.
export const signUp = ({
  name,
  email,
  password,
  agreeTerms,
  agreePrivacy,
  agreeOver14,
}) => {
  return async (dispatch) => {
    try {
      // 회원가입은 인증이 필요하지 않으므로 일반 axios 사용
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        terms_version: TERMS_VERSION,
        privacy_version: PRIVACY_VERSION,
        agree_terms: agreeTerms === true,
        agree_privacy: agreePrivacy === true,
        agree_over_14: agreeOver14 === true,
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
      let fieldErrors = null;

      if (e.response) {
        const { status, data } = e.response;
        console.log("에러 상태:", status);
        console.log("에러 데이터:", data);

        statusCode = status;

        if (status === 400 && typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (status === 422 && Array.isArray(data.detail)) {
          fieldErrors = toSignUpFieldErrors(data.detail);
          errorMessage =
            Object.values(fieldErrors)[0] ||
            data.detail[0]?.msg ||
            errorMessage;
        } else if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        }
      }

      const customError = new Error(errorMessage);
      customError.status = statusCode;
      customError.fieldErrors = fieldErrors;
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
