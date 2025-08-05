import * as Yup from "yup";

const phoneRegExp = /^010-\d{3,4}-\d{4}$/;

export const CustomerSchema = Yup.object().shape({
  name: Yup.string().required("매장명은 필수입니다."),
  phoneNumber: Yup.string()
    .optional()
    .test(
      "is-valid-phone",
      "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
      (value) => {
        // 빈 값은 허용 (optional)
        if (!value) return true;
        // 정규식 검사
        return phoneRegExp.test(value);
      }
    ),
  detail: Yup.string().optional(),
});
