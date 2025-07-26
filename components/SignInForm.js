import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../styles/color";
import { FORM_TYPES } from "../constants/formTypes";
import { BaseInput, PasswordInput } from "./Input";
import { Formik } from "formik";
import { SignInSchema } from "../schemas/signInSchema";
import SubmitButton from "./SubmitButton";
import { signIn } from "../actions/authActions";
import { useDispatch } from "react-redux";

const SignInForm = ({ setFormType }) => {
  const dispatch = useDispatch();

  const handleTransition = () => {
    setFormType(FORM_TYPES.SIGN_UP);
  };

  const handleSignIn = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(signIn(values));
      setFormType(FORM_TYPES.INFO);
    } catch (error) {
      console.log("에러 상태코드:", error.status); // 여기서 접근 가능!

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
      initialValues={{ email: "example@example.com", password: "1234" }}
      validationSchema={SignInSchema}
      onSubmit={handleSignIn}
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
          <View style={styles.contentContainer}>
            <BaseInput
              id="email"
              label={"이메일"}
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              errorText={touched.email && errors.email}
            />
            <PasswordInput
              id="password"
              label={"비밀번호"}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              errorText={touched.password && errors.password}
            />
            <TouchableOpacity
              onPress={() => {}}
              style={styles.transitionButton}
            >
              <Text style={styles.transitionText}>비밀번호 찾기</Text>
            </TouchableOpacity>
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
                title={"로그인"}
                onPress={handleSubmit}
                disable={!isValid || !dirty}
              />
            )}
            <TouchableOpacity
              onPress={handleTransition}
              style={styles.transitionButton}
            >
              <Text style={styles.transitionText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 24,
    width: "100%",
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
