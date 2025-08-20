import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
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
import { useRoute } from "@react-navigation/native";
import colors from "../styles/color";
import { normalizeFont, normalizeSize } from "../utils/responsive"; // ✅ 폰트 & 간격 전용

const StartScreen = () => {
  const route = useRoute();
  const [formType, setFormType] = useState(FORM_TYPES.START);

  useEffect(() => {
    if (route.params?.formType) {
      setFormType(route.params.formType);
    }
  }, [route.params?.formType]);

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
            <Text style={styles.logo} allowFontScaling={false}>
              Gopssl
            </Text>
            <Text style={styles.phrase} allowFontScaling={false}>
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
    paddingTop: normalizeSize(60), // ✅ 반응형 간격
    paddingBottom: normalizeSize(30),
    paddingHorizontal: normalizeSize(24),
  },
  logoContainer: {
    alignItems: "center",
    marginTop: normalizeSize(40), // ✅ 반응형 간격
    gap: normalizeSize(16), // ✅ 반응형 gap
    flex: 1,
  },
  flexibleFormContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  phrase: {
    fontFamily: "gamtanBatangR",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    lineHeight: normalizeFont(28),
    textAlign: "center",
    color: "#2C2E1F",
  },
  logo: {
    width: "100%",
    fontFamily: "logo",
    fontSize: normalizeFont(100),
    color: colors.purple,
    height: normalizeFont(140),
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default StartScreen;
