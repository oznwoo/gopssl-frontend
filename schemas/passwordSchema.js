import * as Yup from "yup";

// 비밀번호 규칙 (백엔드 16b schemas/user.py validate_password_rule 과 동일)
// 회원가입과 비밀번호 변경(19a)에서 같이 쓴다.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_RULE_TEXT = `${PASSWORD_MIN_LENGTH}자 이상, 영문과 숫자를 각각 1개 이상 포함`;

export const passwordField = Yup.string()
  .required("비밀번호는 필수입니다.")
  .min(
    PASSWORD_MIN_LENGTH,
    `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `비밀번호는 ${PASSWORD_MAX_LENGTH}자 이하여야 합니다.`,
  )
  .matches(/[A-Za-z]/, "비밀번호에 영문을 1개 이상 포함해야 합니다.")
  .matches(/[0-9]/, "비밀번호에 숫자를 1개 이상 포함해야 합니다.");

// 비밀번호 확인 칸. ref 이름을 바꿀 수 있게 함수로 둔다 (변경 화면은 newPassword 등)
export const passwordConfirmField = (ref = "password") =>
  Yup.string()
    .required("비밀번호를 한 번 더 입력해주세요.")
    .oneOf([Yup.ref(ref)], "비밀번호가 일치하지 않습니다.");
