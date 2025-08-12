import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("이름은 필수입니다."),
  email: Yup.string()
    .email("올바르지 않은 이메일 형식입니다.")
    .required("이메일은 필수입니다."),
  storeName: Yup.string().required("매장명은 필수입니다."),
  address: Yup.string().required("주소는 필수입니다."),
  addressDetail: Yup.string().optional(),
});
