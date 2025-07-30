import * as Yup from "yup";

export const SaleSchema = Yup.object().shape({
  name: Yup.string().required("고객명은 필수입니다."),
  saleDate: Yup.string().required("시술일은 필수입니다."),
  paymentType: Yup.string().required("결제 유형은 필수입니다."),
  detail: Yup.string().optional(),
  treatmentList: Yup.array()
    .of(
      Yup.object().shape({
        treatment_id: Yup.number().required(),
        price: Yup.number().required(),
      })
    )
    .min(1, "시술 항목을 하나 이상 선택해주세요.")
    .required("시술 항목은 필수입니다."),
  extraPrices: Yup.object()
    .test(
      "is-valid-object",
      "추가 금액 정보가 잘못되었습니다.",
      (value) => typeof value === "object" && value !== null
    )
    .optional(),
});
