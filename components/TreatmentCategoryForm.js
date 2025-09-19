import { Formik } from "formik";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { BaseInput } from "./Input";
import SubmitButton from "../components/SubmitButton";
import colors from "../styles/color";
import { createTreatmentCategory } from "../actions/treatmentActions";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("카테고리명을 입력해주세요."),
});

const TreatmentCategoryForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValues = { name: "" };

  const handleRegister = (values, formikHelpers) => {
    const { setSubmitting, setErrors, resetForm } = formikHelpers;

    Alert.alert(
      "등록 확인",
      "카테고리를 등록하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "등록",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              await dispatch(createTreatmentCategory({ name: values.name }));
              Alert.alert("알림", "카테고리 등록이 완료되었습니다.");
              resetForm();
              onClose(); // 모달 닫기
            } catch (error) {
              console.log(error);
              setErrors({ submit: "등록 중 오류가 발생했습니다." });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.modalContent}>
      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        onSubmit={handleRegister}
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
        }) => {
          return (
            <>
              <BaseInput
                id="name"
                label="카테고리명"
                value={values.name}
                onChangeText={handleChange("name")}
                useBlur={false}
                onBlur={handleBlur("name")}
                errorText={touched.name && errors.name}
              />

              <View style={styles.submitContainer}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.purple} />
                ) : (
                  <SubmitButton
                    title={"등록"}
                    onPress={handleSubmit}
                    disable={!isValid || !dirty}
                  />
                )}
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default TreatmentCategoryForm;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: colors.backgroundPurple,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  submitContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
