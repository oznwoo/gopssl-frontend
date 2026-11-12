import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const UserSchema = Yup.object().shape({
  name: Yup.string().required("이름은 필수입니다."),
  email: Yup.string()
    .email("올바르지 않은 이메일 형식입니다.")
    .required("이메일은 필수입니다."),
  storeName: Yup.string().required("매장명은 필수입니다."),
  // 주소는 선택 입력 (카카오 검색 미사용, 저장만 되고 앱에서 쓰이지 않음)
  address: Yup.string().optional(),
  addressDetail: Yup.string().optional(),
  zipCode: Yup.string().optional(),
});
