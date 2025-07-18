import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import StartForm from "../components/StartForm";

const StartScreen = (props) => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Gopssl</Text>
        <Text style={styles.phrase}>
          {"무질서함에서 질서를, \n복잡함 속에서 아름다움을"}
        </Text>
      </View>
      <StartForm />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 256,
  },
  logoContainer: {
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
});

export default StartScreen;
