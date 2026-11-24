import * as Yup from "yup";
import { passwordField, passwordConfirmField } from "./passwordSchema";

const mustAgree = Yup.boolean().oneOf([true], "필수 항목에 동의해주세요.");

export const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("이름은 필수입니다."),
  email: Yup.string()
    .email("올바르지 않은 이메일 형식입니다.")
    .required("이메일은 필수입니다."),
  password: passwordField,
  passwordConfirm: passwordConfirmField("password"),
  agreeTerms: mustAgree,
  agreePrivacy: mustAgree,
  agreeOver14: mustAgree,
});
