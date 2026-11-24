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
import Input, { BaseInput, PasswordInput } from "./Input";
import SubmitButton from "./SubmitButton";
import { signUp } from "../actions/authActions";
import { SignUpSchema } from "../schemas/signUpSchema";
import { PASSWORD_RULE_TEXT } from "../schemas/passwordSchema";
import ConsentChecklist, { CONSENT_ITEMS } from "./ConsentChecklist";
import { normalizeFont } from "../utils/responsive";

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
      console.log("에러 상태코드:", error.status);

      // 422: 서버 검증 실패(비밀번호 규칙·동의 누락) → 해당 칸에 표시
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setErrors(error.fieldErrors);
      } else if (error.status === 400) {
        // 400은 중복 이메일 에러로 처리
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
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        agreeTerms: false,
        agreePrivacy: false,
        agreeOver14: false,
      }}
      validationSchema={SignUpSchema}
      onSubmit={handleSignUp}
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
          <BaseInput
            id="name"
            label={"이름"}
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            errorText={touched.name && errors.name}
          />
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
          {!(touched.password && errors.password) && (
            <Text style={styles.ruleText}>{PASSWORD_RULE_TEXT}</Text>
          )}
          <PasswordInput
            id="passwordConfirm"
            label={"비밀번호 확인"}
            secureTextEntry
            value={values.passwordConfirm}
            onChangeText={handleChange("passwordConfirm")}
            onBlur={handleBlur("passwordConfirm")}
            // 입력을 시작하면 바로 일치 여부를 보여준다 (blur 기다리지 않음)
            errorText={
              (touched.passwordConfirm || values.passwordConfirm !== "") &&
              errors.passwordConfirm
            }
          />

          <ConsentChecklist
            values={values}
            setFieldValue={setFieldValue}
            errorText={
              CONSENT_ITEMS.map(
                ({ field }) => touched[field] && errors[field],
              ).find(Boolean) || null
            }
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
  ruleText: {
    marginTop: -10,
    paddingHorizontal: 4,
    color: "#6B6B6B",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
    letterSpacing: -0.5,
  },
  transitionButton: {
    alignSelf: "flex-end",
  },
  transitionText: {
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
  },
});
