import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { FORM_TYPES } from "../constants/formTypes";

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
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: 150,
    height: 128,
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
    fontFamily: "tjM",
    fontSize: 20,
    letterSpacing: -1,
    textAlign: "center",
  },
  whiteButtonText: {
    color: colors.purple,
    fontFamily: "tjM",
    fontSize: 20,
    letterSpacing: -1,
    textAlign: "center",
  },
});
