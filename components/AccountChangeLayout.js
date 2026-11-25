import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FormHeader from "./FormHeader";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { normalizeFont } from "../utils/responsive";

// 이메일 변경·비밀번호 변경 화면 공통 틀 (계정 화면과 같은 FormHeader + 하단 버튼).
// 키보드가 올라오면 KeyboardAvoidingView가 아래 버튼을 키보드 위로 올리고,
// 칸은 ScrollView로 스크롤해서 가려지지 않게 한다.
const AccountChangeLayout = ({
  title,
  submitTitle,
  onSubmit,
  isSubmitting,
  disable,
  submitError,
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title={title} />
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.inputContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
        <View
          style={[
            styles.submitContainer,
            { paddingBottom: Platform.OS === "android" ? 10 + insets.bottom : 30 },
          ]}
        >
          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.purple} />
          ) : (
            <SubmitButton title={submitTitle} onPress={onSubmit} disable={disable} />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountChangeLayout;

// 칸 아래 안내 문구 (비밀번호 규칙 등)
export const HelperText = ({ children }) => (
  <Text style={styles.helperText}>{children}</Text>
);

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundPurple,
  },
  inputContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  submitContainer: {
    ...commonStyles.dropShadow,
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 8,
  },
  submitError: {
    textAlign: "center",
    color: colors.alert,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
    letterSpacing: -0.5,
  },
  helperText: {
    marginTop: -10,
    paddingHorizontal: 4,
    color: "#6B6B6B",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
    letterSpacing: -0.5,
  },
});
