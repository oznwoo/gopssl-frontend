import { Formik } from "formik";
import React from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { BaseInput, TypeInput } from "./Input";
import SubmitButton from "../components/SubmitButton";
import { TreatmentSchema } from "../schemas/TreatmentSchema";
import colors from "../styles/color";

const TreatmentForm = ({
  isVisible,
  onClose, // 취소 버튼 혹은 Modal 닫기 이벤트
  initialData, // 수정용
  mode,
}) => {
  const initialValues = initialData
    ? {
        name: initialData.name || "",
        price: initialData.price || 0,
        category: initialData.category || "",
      }
    : {
        name: "",
        price: 0,
        category: "",
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
                onSubmit={() => {}}
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
                      />
                      <BaseInput
                        label="가격"
                        keyboardType="numeric"
                        value={values.price}
                        onChangeText={handleChange("price")}
                        useBlur={false}
                      />
                      <TypeInput
                        label="카테고리"
                        value={values.category}
                        options={["커트", "펌", "염색"]}
                        onChange={(val) => setFieldValue("category", val)}
                        useBlur={false}
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
