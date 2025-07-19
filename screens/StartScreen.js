import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import StartForm from "../components/StartForm";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import InfoForm from "../components/InfoForm";
import { FORM_TYPES } from "../constants/formTypes";

const screenWidth = Dimensions.get("window").width;

const StartScreen = (props) => {
  const [formType, setFormType] = useState(FORM_TYPES.START);

  let CurrentComponent;
  if (formType === "start") CurrentComponent = StartForm;
  else if (formType === "signin") CurrentComponent = SignInForm;
  else if (formType === "signup") CurrentComponent = SignUpForm;
  else if (formType === "info") CurrentComponent = InfoForm;

  return (
    <View style={styles.pageContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Gopssl</Text>
        <Text style={styles.phrase}>
          {"무질서함에서 질서를, \n복잡함 속에서 아름다움을"}
        </Text>
      </View>
      <View style={styles.formContainer}>
        <CurrentComponent setFormType={setFormType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    marginTop: "30%",
    flexDirection: "column",
    gap: 40,
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
    marginBottom: "10%",
    paddingHorizontal: 40,
    width: screenWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StartScreen;
