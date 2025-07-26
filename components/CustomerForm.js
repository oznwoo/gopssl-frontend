import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { BaseInput, DetailInput, PhoneNumberInput } from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer } from "../actions/customerActions";
import { useNavigation } from "@react-navigation/native";

const CustomerForm = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        registerCustomer({
          user_id: id,
          name: values.name,
          phone_number: values.phoneNumber,
          detail: values.detail,
        })
      );

      // 성공 시 이동
      alert("고객 등록이 완료되었습니다.");
      navigation.navigate("Home");
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          setErrors({ name: "입력값이 올바르지 않습니다." });
          alert("입력값을 다시 확인해주세요.");
        } else if (status === 409) {
          setErrors({ phoneNumber: "이미 등록된 전화번호입니다." });
          alert("이미 등록된 고객입니다.");
        } else {
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        alert("네트워크 오류입니다. 인터넷 연결을 확인해주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        phoneNumber: "",
        detail: "",
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
            <BaseInput
              id="name"
              label="고객명"
              useBlur={false}
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              errorText={touched.name && errors.name}
            />
            <PhoneNumberInput
              id="phoneNumber"
              label="전화번호"
              useBlur={false}
              value={values.phoneNumber}
              onChangePhoneNumber={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              errorText={touched.phoneNumber && errors.phoneNumber}
              portraitMode={true}
            />
            <DetailInput
              id="detail"
              label="비고"
              useBlur={false}
              value={values.detail}
              onChangeText={handleChange("detail")}
              onBlur={handleBlur("detail")}
              errorText={touched.detail && errors.detail}
              portraitMode={true}
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

export default CustomerForm;

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
