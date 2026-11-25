import { apiClient } from "../constants/baseURL";
import { registerSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 이름·매장명·주소만 보낸다. 백엔드(19b) PUT /users/me는 email·password를 받지 않으므로
// 이메일·비밀번호는 아래 changeEmail / changePassword 전용 API로만 바꾼다.
export const registerUserInfo = ({
  name,
  store_name,
  address,
  zip_code,
  address_detail,
}) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.put(`/users/me`, {
        name,
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

// ─── 계정 변경 (19a, 백엔드 19b) ───────────────────────────────

const CURRENT_PASSWORD_WRONG = "현재 비밀번호가 올바르지 않습니다.";
const DUPLICATE_EMAIL = "이미 사용 중인 이메일입니다.";
const NETWORK_ERROR = "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

// FastAPI 422 detail([{ loc: ["body", "new_password"], msg }])을 폼 칸별 에러로 바꾼다
const toFieldErrors = (detail, fieldMap) => {
  const fieldErrors = {};
  if (!Array.isArray(detail)) return fieldErrors;
  detail.forEach((item) => {
    const field = fieldMap[item?.loc?.[1]];
    if (!field || fieldErrors[field]) return;
    fieldErrors[field] = String(item.msg || "").replace(/^Value error, /, "");
  });
  return fieldErrors;
};

// 화면이 setErrors(error.fieldErrors)만 하면 되도록 칸별 에러를 담아 던진다.
// 칸에 붙일 수 없는 에러(네트워크·500)는 fieldErrors.submit 으로 둔다.
const accountChangeError = (e, { fieldMap, mapStatus }) => {
  const status = e.response?.status ?? null;
  const detail = e.response?.data?.detail;
  let fieldErrors = {};

  if (status === 422) {
    fieldErrors = toFieldErrors(detail, fieldMap);
  } else if (status) {
    fieldErrors = mapStatus(status, detail) || {};
  }

  if (Object.keys(fieldErrors).length === 0) {
    fieldErrors = {
      submit: status ? "변경 중 오류가 발생했습니다." : NETWORK_ERROR,
    };
  }

  const error = new Error(Object.values(fieldErrors)[0]);
  error.status = status;
  error.fieldErrors = fieldErrors;
  return error;
};

// POST /users/me/password → 200 { message }
// 400 현재 비밀번호 틀림, 422 규칙 위반·현재와 같은 비밀번호
export const changePassword = ({ currentPassword, newPassword }) => {
  return async () => {
    try {
      await apiClient.post(`/users/me/password`, {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (e) {
      throw accountChangeError(e, {
        fieldMap: {
          current_password: "currentPassword",
          new_password: "newPassword",
        },
        mapStatus: (status, detail) =>
          status === 400
            ? { currentPassword: typeof detail === "string" ? detail : CURRENT_PASSWORD_WRONG }
            : null,
      });
    }
  };
};

// POST /users/me/email → 200 UserRead
// 400 현재 비밀번호 틀림·현재 이메일과 같음, 409 이미 사용 중, 422
// 성공하면 redux auth.user와 AsyncStorage "user"를 새 정보로 바꾼다.
export const changeEmail = ({ currentPassword, newEmail }) => {
  return async (dispatch) => {
    let user;
    try {
      const response = await apiClient.post(`/users/me/email`, {
        current_password: currentPassword,
        new_email: newEmail,
      });
      user = response.data;
    } catch (e) {
      throw accountChangeError(e, {
        fieldMap: {
          current_password: "currentPassword",
          new_email: "newEmail",
        },
        mapStatus: (status, detail) => {
          if (status === 409) return { newEmail: DUPLICATE_EMAIL };
          if (status !== 400) return null;
          // 400은 두 가지라 detail 문구로 구분한다. 비밀번호 확인이 먼저라
          // 알 수 없는 400은 현재 비밀번호 칸에 둔다.
          const message = typeof detail === "string" ? detail : CURRENT_PASSWORD_WRONG;
          return message.includes("이메일")
            ? { newEmail: message }
            : { currentPassword: message };
        },
      });
    }

    dispatch(registerSuccess({ user }));
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  };
};
