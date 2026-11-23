import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const UserSchema = Yup.object().shape({
  name: Yup.string().required("이름은 필수입니다."),
  email: Yup.string()
    .email("올바르지 않은 이메일 형식입니다.")
    .required("이메일은 필수입니다."),
  storeName: Yup.string().required("매장명은 필수입니다."),
  // 주소는 필수 (11/24 결정). 평소엔 우편번호 검색으로 채우고, 검색 실패 시에만 직접 입력.
  // 필수 검사는 프론트에서만 한다 (백엔드 필수화는 별도)
  address: Yup.string().trim().required("가게 주소를 검색해 주세요."),
  addressDetail: Yup.string().optional(),
  zipCode: Yup.string().optional(),
});
