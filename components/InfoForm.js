import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../styles/color";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { Formik } from "formik";
import { InfoSchema } from "../schemas/InfoSchema";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUserInfo } from "../actions/userActions";

const InfoForm = ({ setFormType }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.auth.user);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        registerUserInfo({
          ...userData,
          store_name: values.storeName,
          address: values.address,
          zip_code: values.zipCode,
          address_detail: values.addressDetail,
        })
      );
    } catch (error) {
      console.log("에러 상태코드:", error.message); // 여기서 접근 가능!

      // 400은 중복 이메일 에러로 처리
      if (error.status === 400) {
        setErrors({ email: error.message });
      } else {
        setErrors({ password: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        storeName: "",
        address: "",
        zipCode: "",
        addressDetail: "",
      }}
      validationSchema={InfoSchema}
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
        setFieldValue,
      }) => (
        <View style={styles.formContainer}>
          <View style={styles.contentContainer}>
            <Input
              id="store_name"
              label={"매장명"}
              autoCapitalize="none"
              value={values.storeName}
              onChangeText={handleChange("storeName")}
              onBlur={handleBlur("storeName")}
              errorText={touched.storeName && errors.storeName}
            />
            <Input
              id="address"
              label={"주소"}
              autoCapitalize="none"
              value={values.address}
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              errorText={touched.address && errors.address}
              onPressIcon={() => {
                navigation.navigate("AddressSearchScreen", {
                  onSelect: (selected) => {
                    setFieldValue("address", selected.addressName);
                    setFieldValue("zipCode", selected.zipCode);
                  },
                });
              }}
              readOnly
            />

            <Input
              id="zip_code"
              label={"우편번호"}
              autoCapitalize="none"
              value={values.zipCode}
              readOnly
            />

            <Input
              id="address_detail"
              label={"상세주소"}
              autoCapitalize="none"
              value={values.addressDetail}
              onChangeText={handleChange("addressDetail")}
              onBlur={handleBlur("addressDetail")}
              errorText={touched.addressDetail && errors.addressDetail}
            />
          </View>

          <View style={styles.contentContainer}>
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={colors.purple}
                style={{ marginTop: 10 }}
              />
            ) : (
              <SubmitButton
                title={"완료"}
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

export default InfoForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 24,
    width: "100%",
    marginBottom: 28,
  },
  contentContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: 16,
  },
  purpleButton: {
    backgroundColor: colors.purple,
    borderColor: "rgba(216, 29, 223, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  purpleButtonText: {
    color: "white",
    fontFamily: "tjM",
    fontSize: 16,
    letterSpacing: -1,
    textAlign: "center",
  },
  transitionButton: {
    alignSelf: "flex-end",
  },

  transitionText: {
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
    fontSize: 12,
  },
});
