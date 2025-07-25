import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";

import colors from "../styles/color";
import { FORM_TYPES } from "../constants/formTypes";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { signUp } from "../actions/authActions";
import { SignUpSchema } from "../schemas/signUpSchema";

const SignUpForm = ({ setFormType }) => {
  const dispatch = useDispatch();

  const handleTransition = () => {
    setFormType(FORM_TYPES.SIGN_IN);
  };

  const handleSignUp = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(signUp(values));
      setFormType(FORM_TYPES.INFO);
    } catch (error) {
      console.log("에러 상태코드:", error.status); // 여기서 접근 가능!

      // 400은 중복 이메일 에러로 처리
      if (error.status === 400) {
        setErrors({ email: error.message });
      } else {
        setErrors({ password: error.message });
      }
      setIsLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={SignUpSchema}
      onSubmit={handleSignUp}
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
          <Input
            id="name"
            label={"이름"}
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            errorText={touched.name && errors.name}
          />
          <Input
            id="email"
            label={"이메일"}
            autoCapitalize="none"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            errorText={touched.email && errors.email}
          />
          <Input
            id="password"
            label={"비밀번호"}
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            errorText={touched.password && errors.password}
          />

          {isSubmitting ? (
            <ActivityIndicator
              size="small"
              color={colors.purple}
              style={{ marginTop: 10 }}
            />
          ) : (
            <SubmitButton
              title={"회원가입"}
              onPress={handleSubmit}
              disable={!isValid || !dirty}
            />
          )}

          <TouchableOpacity
            onPress={handleTransition}
            style={styles.transitionButton}
          >
            <Text style={styles.transitionText}>로그인</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
    width: "100%",
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
