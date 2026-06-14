import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
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
import { normalizeFont, normalizeSize } from "../utils/responsive";

const SignInForm = ({ setFormType }) => {
  const dispatch = useDispatch();

  const handleTransition = () => {
    setFormType(FORM_TYPES.SIGN_UP);
  };

  const handleSignIn = async (values, { setSubmitting, setErrors }) => {
    try {
      const { email, password, rememberMe } = values;
      await dispatch(signIn({ email, password, rememberMe }));

      setFormType(FORM_TYPES.INFO);
    } catch (error) {
      if (error.status === 400) setErrors({ email: error.message });
      else setErrors({ password: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={SignInSchema}
      onSubmit={handleSignIn}
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
      }) => (
        <View style={styles.formContainer}>
          <View style={styles.contentContainer}>
            <View style={{ gap: 16 }}>
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
            </View>

            <View style={styles.autoLoginContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setFieldValue("rememberMe", !values.rememberMe)}
              >
                <View
                  style={[styles.checkbox, values.rememberMe && styles.checked]}
                >
                  {values.rememberMe && <View style={styles.innerCheck} />}
                </View>
                <Text style={styles.checkboxLabel}>자동 로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {}}
                style={styles.searchPassword}
              >
                <Text style={styles.transitionText}>비밀번호 찾기</Text>
              </TouchableOpacity>
            </View>
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
    gap: 12,
    width: "100%",
  },
  contentContainer: {
    gap: 12,
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
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
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
    fontSize: normalizeFont(16),
    letterSpacing: -1,
    textAlign: "center",
  },
  autoLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginLeft: 4,
    width: normalizeSize(18),
    height: normalizeSize(18),
    borderWidth: 1,
    borderColor: "#2E2B1C",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    borderColor: colors.purple,
    backgroundColor: colors.purple,
  },
  innerCheck: {
    width: normalizeSize(10),
    height: normalizeSize(10),
    borderRadius: 2,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: normalizeFont(12),
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
  },

  transitionButton: { alignSelf: "flex-end" },

  transitionText: {
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
  },
});
