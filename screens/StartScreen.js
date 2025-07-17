import React from "react";
import { Text, StyleSheet } from "react-native";

const StartScreen = (props) => {
  return <Text style={styles.logo}>Gopssl</Text>;
};

const styles = StyleSheet.create({
  logo: {
    fontFamily: "logo",
    fontSize: 80,
    color: "#743D7B",
  },
});

export default StartScreen;
