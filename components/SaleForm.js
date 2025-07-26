import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import { CustomerSchema } from "../schemas/CustomerSchema";
import {
  AddressInput,
  BaseInput,
  DetailInput,
  PhoneNumberInput,
  DateInput,
} from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer } from "../actions/customerActions";
import { useNavigation } from "@react-navigation/native";

const SaleForm = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      // 성공 시 이동
      alert("고객 등록이 완료되었습니다.");
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        saleDate: "",
        paymentType: "",
        detail: "",
        treatmentList: {},
      }}
      validationSchema={CustomerSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <View style={styles.formContainer}>
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
              id="phoneNumber"
              label="시술일"
              useBlur={false}
              value={values.phoneNumber}
              onChangePhoneNumber={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              errorText={touched.phoneNumber && errors.phoneNumber}
            />
            <BaseInput
              id="detail"
              label="시술"
              useBlur={false}
              value={values.detail}
              onChangeText={handleChange("detail")}
              onBlur={handleBlur("detail")}
              errorText={touched.detail && errors.detail}
            />
            <BaseInput
              id="detail"
              label="결제 유형"
              useBlur={false}
              value={values.detail}
              onChangeText={handleChange("detail")}
              onBlur={handleBlur("detail")}
              errorText={touched.detail && errors.detail}
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
