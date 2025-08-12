import axios from "axios";
import {
  signUpSuccess,
  signInSuccess,
  logout as logoutAction,
} from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/baseURL";

export const signUp = ({ name, email, password }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      const token = response.data.access_token; // 백엔드 키 이름에 맞춤

      await AsyncStorage.setItem("token", token);

      // 토큰 받은 뒤, 유저 정보 요청 추가
      const userRes = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userRes.data;

      dispatch(signUpSuccess({ token, user }));

      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      let errorMessage = "회원가입에 실패했습니다.";
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

export const signIn = ({ email, password }) => {
  return async (dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("username", email); // OAuth2PasswordRequestForm에서는 username으로 받음
      params.append("password", password);

      const response = await axios.post(`${BASE_URL}/auth/signin`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;

      await AsyncStorage.setItem("token", token);

      // 토큰 받은 뒤, 유저 정보 요청 추가
      const userRes = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userRes.data;

      dispatch(signInSuccess({ token, user }));

      await AsyncStorage.setItem("user", JSON.stringify(user));
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
      customError.status = statusCode; // ✅ 상태코드 추가
      throw customError;
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      // AsyncStorage에서 토큰과 유저 정보 삭제
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // Redux 상태 초기화
      dispatch(logoutAction());
    } catch (e) {
      console.error("로그아웃 중 오류 발생:", e);
      // 필요시 에러 처리 추가
    }
  };
};
