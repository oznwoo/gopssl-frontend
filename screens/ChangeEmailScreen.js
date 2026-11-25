import React, { useMemo } from "react";
import { Alert } from "react-native";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import AccountChangeLayout, { HelperText } from "../components/AccountChangeLayout";
import { BaseInput, PasswordInput } from "../components/Input";
import { changeEmail } from "../actions/userActions";
import { makeChangeEmailSchema } from "../schemas/AccountSchema";

// 설정 > 계정 > 이메일(아이디) 변경 (19a)
// 성공하면 changeEmail 액션이 redux auth.user·AsyncStorage "user"를 갱신하고 계정 화면으로 돌아간다
const ChangeEmailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentEmail = useSelector((state) => state.auth.user?.email);
  const schema = useMemo(() => makeChangeEmailSchema(currentEmail), [currentEmail]);

  const handleChange = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        changeEmail({
          currentPassword: values.currentPassword,
          newEmail: values.newEmail.trim(),
        }),
      );
      Alert.alert("알림", "이메일이 변경되었습니다.\n다음 로그인부터 새 이메일을 사용하세요.", [
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
      initialValues={{ newEmail: "", currentPassword: "" }}
      validationSchema={schema}
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
          title="이메일 변경"
          submitTitle="변경"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disable={!isValid || !dirty}
          submitError={errors.submit}
        >
          <BaseInput id="currentEmail" label="현재 이메일" value={currentEmail || ""} readOnly />
          <BaseInput
            id="newEmail"
            label="새 이메일"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={values.newEmail}
            onChangeText={onChange("newEmail")}
            onBlur={handleBlur("newEmail")}
            errorText={touched.newEmail && errors.newEmail}
          />
          {!(touched.newEmail && errors.newEmail) && (
            <HelperText>새 이메일은 로그인 아이디로 사용됩니다.</HelperText>
          )}
          <PasswordInput
            id="currentPassword"
            label="현재 비밀번호"
            autoCapitalize="none"
            value={values.currentPassword}
            onChangeText={onChange("currentPassword")}
            onBlur={handleBlur("currentPassword")}
            errorText={touched.currentPassword && errors.currentPassword}
          />
        </AccountChangeLayout>
      )}
    </Formik>
  );
};

export default ChangeEmailScreen;
