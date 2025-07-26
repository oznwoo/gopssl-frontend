import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { BaseInput, DetailInput, PhoneNumberInput } from "./Input";

const CustomerForm = () => {
  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={{
        name: "",
        phoneNumber: "",
        detail: "",
      }}
      validationSchema={CustomerSchema}
      onSubmit={handleSubmit}
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
                onPress={() => {
                  console.log(values);
                }}
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
