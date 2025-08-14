import { apiClient } from "../constants/baseURL";
import { registerSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const response = await apiClient.put(`/users/me`, {
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
