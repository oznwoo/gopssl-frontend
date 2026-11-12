import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const InfoSchema = Yup.object().shape({
  storeName: Yup.string().required("매장명은 필수입니다."),
  // 주소는 선택 입력 (카카오 검색 미사용, 저장만 되고 앱에서 쓰이지 않음)
  address: Yup.string().optional(),
  addressDetail: Yup.string().optional(),
  zipCode: Yup.string().optional(),
});
