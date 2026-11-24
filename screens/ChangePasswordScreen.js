import React from "react";
import { Alert } from "react-native";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import AccountChangeLayout, { HelperText } from "../components/AccountChangeLayout";
import { PasswordInput } from "../components/Input";
import { changePassword } from "../actions/userActions";
import { ChangePasswordSchema } from "../schemas/AccountSchema";
import { PASSWORD_RULE_TEXT } from "../schemas/passwordSchema";

// 설정 > 계정 > 비밀번호 변경 (19a)
// 성공하면 안내 후 계정 화면으로 돌아간다. 로그아웃시키지 않는다 (티켓 결정)
const ChangePasswordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleChange = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      );
      Alert.alert("알림", "비밀번호가 변경되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setErrors(error.fieldErrors || { submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ currentPassword: "", newPassword: "", newPasswordConfirm: "" }}
      validationSchema={ChangePasswordSchema}
      onSubmit={handleChange}
    >
      {({
        handleChange: onChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <AccountChangeLayout
          title="비밀번호 변경"
          submitTitle="변경"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disable={!isValid || !dirty}
          submitError={errors.submit}
        >
          <PasswordInput
            id="currentPassword"
            label="현재 비밀번호"
            autoCapitalize="none"
            value={values.currentPassword}
            onChangeText={onChange("currentPassword")}
            onBlur={handleBlur("currentPassword")}
            errorText={touched.currentPassword && errors.currentPassword}
          />
          <PasswordInput
            id="newPassword"
            label="새 비밀번호"
            autoCapitalize="none"
            value={values.newPassword}
            onChangeText={onChange("newPassword")}
            onBlur={handleBlur("newPassword")}
            errorText={touched.newPassword && errors.newPassword}
          />
          {!(touched.newPassword && errors.newPassword) && (
            <HelperText>{PASSWORD_RULE_TEXT}</HelperText>
          )}
          <PasswordInput
            id="newPasswordConfirm"
            label="새 비밀번호 확인"
            autoCapitalize="none"
            value={values.newPasswordConfirm}
            onChangeText={onChange("newPasswordConfirm")}
            onBlur={handleBlur("newPasswordConfirm")}
            // 가입 폼과 같이, 입력을 시작하면 바로 일치 여부를 보여준다
            errorText={
              (touched.newPasswordConfirm || values.newPasswordConfirm !== "") &&
              errors.newPasswordConfirm
            }
          />
        </AccountChangeLayout>
      )}
    </Formik>
  );
};

export default ChangePasswordScreen;
