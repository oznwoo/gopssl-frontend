import { Formik } from "formik";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { BaseInput } from "./Input";
import SubmitButton from "../components/SubmitButton";
import colors from "../styles/color";
import {
  createTreatmentCategory,
  updateTreatmentCategory,
  deleteTreatmentCategory,
} from "../actions/treatmentActions";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("카테고리명을 입력해주세요."),
});

const TreatmentCategoryForm = ({ onClose, mode = "register", data }) => {
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.treatment);

  const initialValues = data ? { name: data.name || "" } : { name: "" };

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

  const handleUpdate = (values, formikHelpers) => {
    const { setSubmitting, setErrors } = formikHelpers;

    Alert.alert(
      "수정 확인",
      "카테고리명을 수정하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "수정",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              await dispatch(
                updateTreatmentCategory({
                  category_id: data.id,
                  name: values.name,
                })
              );
              Alert.alert("알림", "카테고리 수정이 완료되었습니다.");
              onClose();
            } catch (error) {
              console.log(error);
              setErrors({ submit: "수정 중 오류가 발생했습니다." });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = () => {
    const categoryId = data?.id;
    if (!categoryId) return;

    // 해당 카테고리에 속한 시술이 있는지 확인
    const hasTreatments = treatments.some(
      (treatment) => treatment.category_id === categoryId
    );

    if (hasTreatments) {
      Alert.alert(
        "삭제 불가",
        "해당 카테고리에 속한 시술이 있어 삭제할 수 없습니다."
      );
      return;
    }

    Alert.alert(
      "삭제 확인",
      "카테고리를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteTreatmentCategory(categoryId));
              Alert.alert("알림", "카테고리가 삭제되었습니다.");
              onClose();
            } catch (error) {
              const errorMessage =
                error.response?.data?.detail || "삭제 중 문제가 발생했습니다.";
              Alert.alert("삭제 실패", errorMessage);
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
        onSubmit={mode === "view" ? handleUpdate : handleRegister}
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
  submitButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
