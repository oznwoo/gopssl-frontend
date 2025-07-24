import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const InfoSchema = Yup.object().shape({
  storeName: Yup.string().required("매장명은 필수입니다."),
  address: Yup.string().required("주소는 필수입니다."),
  addressDetail: Yup.string().optional(),
});
