import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { FORM_TYPES } from "../constants/formTypes";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const StartForm = ({ setFormType }) => {
  const handleSignUp = () => {
    setFormType(FORM_TYPES.SIGN_UP);
  };
  const handleSignIn = () => {
    setFormType(FORM_TYPES.SIGN_IN);
  };

  return (
    <View style={styles.formContainer}>
      <TouchableOpacity
        style={{
          ...styles.button,
          ...styles.purpleButton,
          ...commonStyles.dropShadow,
        }}
        onPress={handleSignUp}
      >
        <Text style={styles.purpleButtonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          ...styles.whiteButton,
          ...commonStyles.dropShadow,
        }}
        onPress={handleSignIn}
      >
        <Text style={styles.whiteButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartForm;

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: "row",
    gap: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: normalizeSize(150),
    height: normalizeSize(128),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 1,
  },
  purpleButton: {
    backgroundColor: colors.purple,
    borderColor: "rgba(216, 29, 223, 0.5)",
  },
  whiteButton: {
    backgroundColor: "white",
    borderColor: "#BBC5C0",
  },
  purpleButtonText: {
    color: "white",
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(20),
    letterSpacing: -1.5,
    textAlign: "center",
    width: "100%",
  },
  whiteButtonText: {
    color: colors.purple,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(20),
    letterSpacing: -1.5,
    textAlign: "center",
    width: "100%",
  },
});
