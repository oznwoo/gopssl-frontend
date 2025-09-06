import { apiClient, BASE_URL } from "../constants/baseURL";
import {
  signUpSuccess,
  signInSuccess,
  logout as logoutAction,
  registerSuccess,
} from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCustomer } from "./customerActions";
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

      // AsyncStorage 업데이트
      await AsyncStorage.setItem("token", newToken);

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
      await AsyncStorage.setItem("token", token);

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
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("token");
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

export const logout = () => {
  return async (dispatch) => {
    try {
      // Redux 상태 초기화
      dispatch(logoutAction());
    } catch (e) {
      console.error("로그아웃 중 오류 발생:", e);
      // 필요시 에러 처리 추가
    }
  };
};
