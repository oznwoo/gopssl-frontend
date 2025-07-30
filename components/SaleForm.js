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
    console.log("💾 제출된 값:", values); // ← 여기서 전체 값 확인
    try {
      alert("고객 등록이 완료되었습니다.");
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        saleDate: formattedSaleDate,
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
                onChangePhoneNumber={handleChange("saleDate")}
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
