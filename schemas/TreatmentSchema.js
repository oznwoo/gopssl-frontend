import * as Yup from "yup";

export const TreatmentSchema = Yup.object().shape({
  name: Yup.string().required("고객명은 필수입니다."),
  price: Yup.number().required("가격은 필수입니다."),
  category: Yup.string().required("시술 유형은 필수입니다."),
});
