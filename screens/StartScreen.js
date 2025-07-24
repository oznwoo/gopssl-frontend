import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import StartForm from "../components/StartForm";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import InfoForm from "../components/InfoForm";
import { FORM_TYPES } from "../constants/formTypes";

const screenHeight = Dimensions.get("window").height;

const StartScreen = (props) => {
  const [formType, setFormType] = useState(FORM_TYPES.START);

  let CurrentComponent;
  if (formType === "start") CurrentComponent = StartForm;
  else if (formType === "signin") CurrentComponent = SignInForm;
  else if (formType === "signup") CurrentComponent = SignUpForm;
  else if (formType === "info") CurrentComponent = InfoForm;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.pageContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Gopssl</Text>
            <Text style={styles.phrase}>
              {"무질서함에서 질서를, \n복잡함 속에서 아름다움을"}
            </Text>
          </View>

          <View style={styles.flexibleFormContainer}>
            <CurrentComponent setFormType={setFormType} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: screenHeight * 0.1, // 10% 아래
    paddingBottom: screenHeight * 0.05, // 5% 위
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  flexibleFormContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end", // 폼 중앙 정렬
  },
  phrase: {
    fontFamily: "gamtanBatangR",
    fontSize: 16,
    letterSpacing: -1.5,
    lineHeight: 32,
    textAlign: "center",
    color: "#2C2E1F",
  },
  logo: {
    fontFamily: "logo",
    fontSize: 80,
    color: "#743D7B",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default StartScreen;
