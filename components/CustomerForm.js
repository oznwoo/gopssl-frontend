import React from "react";
import { ActivityIndicator, StyleSheet, View, Alert } from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { BaseInput, DetailInput, PhoneNumberInput } from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomerById,
  registerCustomer,
  updateCustomer,
} from "../actions/customerActions";
import { useNavigation } from "@react-navigation/native";

const CustomerForm = ({ data, mode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

  // 초깃값 설정: view 모드든 edit/등록 모드든 기본적으로 수정 가능한 값으로 세팅
  const initialValues =
    mode === "view" && data
      ? {
          name: data.name,
          phoneNumber: data.phone_number ? data.phone_number : "",
          detail: data.detail ? data.detail : "",
        }
      : { name: "", phoneNumber: "", detail: "" };
  console.log(initialValues);

  // 등록 핸들러
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
      Alert.alert("알림", "고객 등록이 완료되었습니다.");
      navigation.navigate("Home");
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 수정 핸들러 (view 모드 포함)
  const handleUpdate = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        updateCustomer({
          customer_id: data.id,
          user_id: id,
          name: values.name,
          phone_number: values.phoneNumber,
          detail: values.detail,
        })
      );
      Alert.alert("알림", "고객 정보 수정이 완료되었습니다.");
      navigation.navigate("Home");
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async ({ setSubmitting, setErrors }) => {
    try {
      const customerId = data?.id;

      await dispatch(deleteCustomerById(customerId));
      Alert.alert("알림", "고객이 삭제되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "삭제 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CustomerSchema}
      onSubmit={mode === "view" ? handleUpdate : handleRegister} // view 모드에서도 수정 처리
      enableReinitialize
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
              editable={true} // 항상 수정 가능
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
              editable={true} // 수정 가능
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
              editable={true} // 수정 가능
            />
          </View>
          <View style={styles.submitContainer}>
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={colors.purple}
                style={{ marginTop: 10 }}
              />
            ) : mode === "view" ? (
              <View style={styles.submitButtons}>
                <SubmitButton
                  title={"수정"}
                  onPress={handleSubmit}
                  size={"small"}
                  disable={!isValid || !dirty}
                />
                <SubmitButton
                  title={"삭제"}
                  size={"small"}
                  onDelete={handleDelete}
                />
              </View>
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
    width: "100%",
    backgroundColor: colors.backgroundPurple,
    justifyContent: "space-between",
  },
  inputContainer: {
    gap: 16,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  submitContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
