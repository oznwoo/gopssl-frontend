import { Formik } from "formik";
import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
} from "react-native";
import { BaseInput, TypeInput } from "./Input";
import SubmitButton from "../components/SubmitButton";
import { TreatmentSchema } from "../schemas/TreatmentSchema";
import colors from "../styles/color";
import {
  createTreatment,
  deleteTreatment,
  updateTreatment,
} from "../actions/treatmentActions";
import { useDispatch, useSelector } from "react-redux";

const TreatmentForm = ({
  isVisible,
  onClose, // 취소 버튼 혹은 Modal 닫기 이벤트
  data, // 수정용
  mode,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.treatment);
  const typeOptions = categories.map((item) => item.name);

  const initialValues = data
    ? {
        name: data.name || "",
        price: data.default_price || 0,
        category:
          categories.find((item) => item.id === data?.category_id)?.name || "",
      }
    : {
        name: "",
        price: 0,
        category: "",
      };

  const handleRegister = (values, formikHelpers) => {
    const { setSubmitting, setErrors, resetForm } = formikHelpers;

    Alert.alert(
      "등록 확인",
      "시술을 등록하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "등록",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              const category_id = categories.find(
                (item) => item.name === values.category
              ).id;

              const treatmentData = {
                name: values.name,
                category_id,
                default_price: values.price,
              };

              await dispatch(createTreatment(treatmentData));
              Alert.alert("알림", "시술 등록이 완료되었습니다.");
              resetForm();
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
    const { setSubmitting, setErrors, resetForm } = formikHelpers;

    Alert.alert(
      "수정 확인",
      "시술을 수정하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "수정",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              const category_id = categories.find(
                (item) => item.name === values.category
              ).id;

              const treatmentData = {
                treatment_id: data?.id,
                name: values.name,
                category_id,
                default_price: values.price,
              };

              await dispatch(updateTreatment(treatmentData));
              Alert.alert("알림", "시술 수정이 완료되었습니다.");
              resetForm();
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

  // 삭제 핸들러
  const handleDelete = () => {
    const treatment_id = data?.id;

    Alert.alert(
      "삭제 확인",
      "시술을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteTreatment(treatment_id));
              Alert.alert("알림", "시술이 삭제되었습니다.");
              onClose();
            } catch (error) {
              console.log(error);
              setErrors({ submit: "삭제 중 오류가 발생했습니다." });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* 안쪽 눌렀을 땐 닫히지 않도록 Pressable 추가 */}
          <Pressable style={styles.modalContentWrapper} onPress={() => {}}>
            <View style={styles.modalContent}>
              <Formik
                initialValues={initialValues}
                validationSchema={TreatmentSchema}
                onSubmit={mode === "view" ? handleUpdate : handleRegister}
                enableReinitialize
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
                }) => {
                  return (
                    <>
                      <BaseInput
                        id="name"
                        label="시술명"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        useBlur={false}
                        onBlur={handleBlur("name")}
                      />
                      <BaseInput
                        id="price"
                        label="가격"
                        keyboardType="numeric"
                        value={values.price ? String(values.price) : ""}
                        onChangeText={handleChange("price")}
                        useBlur={false}
                        onBlur={handleBlur("price")}
                      />
                      <TypeInput
                        id="category"
                        label="카테고리"
                        value={values.category}
                        options={typeOptions}
                        onChange={(val) => setFieldValue("category", val)}
                        useBlur={false}
                        onBlur={handleBlur("category")}
                      />

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
                    </>
                  );
                }}
              </Formik>
            </View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TreatmentForm;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    width: "80%",
  },
  modalContent: {
    backgroundColor: colors.backgroundPurple,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
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
