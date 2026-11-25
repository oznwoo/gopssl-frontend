import * as Yup from "yup";
import { passwordField, passwordConfirmField } from "./passwordSchema";

const currentPasswordField = Yup.string().required("현재 비밀번호를 입력해주세요.");

// 비밀번호 변경 (19a). 새 비밀번호 규칙은 회원가입(16a)과 같은 passwordField
export const ChangePasswordSchema = Yup.object().shape({
  currentPassword: currentPasswordField,
  newPassword: passwordField.notOneOf(
    [Yup.ref("currentPassword")],
    "새 비밀번호가 현재 비밀번호와 같습니다.",
  ),
  newPasswordConfirm: passwordConfirmField("newPassword"),
});

// 이메일 변경 (19a). 현재 이메일과 같은 값은 서버에서도 400이지만 미리 막는다
export const makeChangeEmailSchema = (currentEmail) =>
  Yup.object().shape({
    newEmail: Yup.string()
      .trim()
      .email("올바르지 않은 이메일 형식입니다.")
      .required("새 이메일을 입력해주세요.")
      .notOneOf(currentEmail ? [currentEmail] : [], "현재 이메일과 같습니다."),
    currentPassword: currentPasswordField,
  });
