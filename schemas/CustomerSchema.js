import * as Yup from "yup";

// ✅ Yup 스키마 정의
export const CustomerSchema = Yup.object().shape({
  name: Yup.string().required("매장명은 필수입니다."),
  phoneNumber: Yup.string().optional(),
  detail: Yup.string().optional(),
});
