import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { FORM_TYPES } from "../constants/formTypes";
import Input from "./Input";

const SignInForm = ({ setFormType }) => {
  const handleTransition = () => {
    setFormType(FORM_TYPES.SIGN_UP);
  };

  const handleSignIn = () => {
    setFormType(FORM_TYPES.INFO);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.contentContainer}>
        <Input id="email" label={"이메일"} />
        <Input id="password" label={"비밀번호"} />
        <TouchableOpacity
          onPress={handleTransition}
          style={styles.transitionButton}
        >
          <Text style={styles.transitionText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={handleSignIn}
          style={{
            ...styles.button,
            ...styles.purpleButton,
            ...commonStyles.dropShadow,
          }}
        >
          <Text style={styles.purpleButtonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleTransition}
          style={styles.transitionButton}
        >
          <Text style={styles.transitionText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
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
