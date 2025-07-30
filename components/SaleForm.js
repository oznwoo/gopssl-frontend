import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import {
  AddressInput,
  BaseInput,
  DetailInput,
  DateInput,
  TreatmentInput,
  TypeInput,
} from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SaleSchema } from "../schemas/SaleSchema";
import { postSaleThunk } from "../actions/saleActions";

const SaleForm = ({ saleDate }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);
  const formattedSaleDate = saleDate
    ? `${new Date(saleDate).getFullYear()}년 ${
        new Date(saleDate).getMonth() + 1
      }월 ${new Date(saleDate).getDate()}일`
    : "";

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const user_id = id; // Redux에서 가져온 로그인 유저 ID
      const customer_id = 1;

      // sale_date를 ISO 날짜 문자열로 변환 (DateInput에서 'yyyy-mm-dd' 형식으로 받는다고 가정)
      const sale_date = new Date(values.saleDate).toISOString().split("T")[0]; // "2025-07-30"

      // treatments 배열을 { treatment_id, price } 형태로 맞추기
      const treatments = values.treatmentList.map(
        ({ treatment_id, price }) => ({
          treatment_id,
          price,
        })
      );

      // total_amount 계산 (optional)
      // 예시: treatments 가격 합 + extra_prices 합 (필요하면 구현)
      const total_amount =
        treatments.reduce((acc, cur) => acc + cur.price, 0) +
        Object.values(values.extraPrices || {}).reduce(
          (acc, cur) => acc + cur,
          0
        );

      const saleData = {
        user_id,
        customer_id,
        sale_date,
        detail: values.detail,
        payment_type: values.paymentType,
        total_amount,
        treatments,
        extra_prices: values.extraPrices,
      };

      // Redux thunk 호출 (포스트 요청)
      await dispatch(postSaleThunk(saleData));

      alert("고객 등록이 완료되었습니다.");
      navigation.goBack(); // 등록 후 이전 화면으로 이동 (필요에 따라)
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "등록 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        saleDate: new Date(), // Date 객체 기본값
        paymentType: "",
        detail: "",
        treatmentList: [],
        extraPrices: {},
      }}
      validationSchema={SaleSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <View style={styles.formContainer}>
          <ScrollView>
            <View style={styles.inputContainer}>
              <AddressInput
                id="name"
                label="고객명"
                useBlur={false}
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                errorText={touched.name && errors.name}
                onPressIcon={() => {}}
              />
              <DateInput
                id="saleDate"
                label="시술일"
                useBlur={false}
                value={values.saleDate}
                onChangeDate={(date) => setFieldValue("saleDate", date)} // Date 객체 그대로 저장
                onBlur={handleBlur("saleDate")}
                errorText={touched.saleDate && errors.saleDate}
              />
              <TreatmentInput
                id="treatments"
                label="시술"
                useBlur={false}
                onBlur={handleBlur("treatmentList")}
                errorText={touched.treatmentList && errors.treatmentList}
                onTreatmentDataChange={({ treatments, extraPrices }) => {
                  setFieldValue("treatmentList", treatments);
                  setFieldValue("extraPrices", extraPrices);
                }}
              />
              <TypeInput
                id="paymentType"
                label="결제 유형"
                useBlur={false}
                value={values.paymentType}
                options={["현금", "카드"]}
                onChange={(val) => setFieldValue("paymentType", val)}
                onBlur={handleBlur("paymentType")}
                errorText={touched.paymentType && errors.paymentType}
              />
              <DetailInput
                id="detail"
                label="시술 내용"
                useBlur={false}
                value={values.detail}
                onChangeText={handleChange("detail")}
                onBlur={handleBlur("detail")}
                errorText={touched.detail && errors.detail}
              />
            </View>
          </ScrollView>
          <View style={styles.submitContainer}>
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={colors.purple}
                style={{ marginTop: 10 }}
              />
            ) : (
              <SubmitButton
                title={"등록"}
                onPress={handleSubmit}
                disable={!isValid || !dirty}
              />
            )}
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SaleForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  inputContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },

  submitContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
