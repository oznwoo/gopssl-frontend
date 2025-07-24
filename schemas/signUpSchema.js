import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("이름은 필수입니다."),
  email: Yup.string()
    .email("올바르지 않은 이메일 형식입니다.")
    .required("이메일은 필수입니다."),
  password: Yup.string()
    .min(4, "비밀번호는 4자 이상이어야 합니다.")
    .required("비밀번호는 필수입니다."),
});
