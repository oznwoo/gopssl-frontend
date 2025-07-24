import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/baseURL";

export const registerStore = ({ name, email, password }) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/${user_id}`, {
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

      dispatch(loginSuccess({ token, user }));

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
