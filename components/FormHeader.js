import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";

const FormHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={props.onGoBack} style={styles.goBackButton}>
        <FontAwesome5 name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{props.title}</Text>
      </View>
    </View>
  );
};

export default FormHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.purple,
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    padding: 24,
  },
  goBackButton: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: { flex: 1, pointerEvents: "none" },
  headerTitle: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "gamtanDotumB",
    fontSize: 20,
    letterSpacing: "-0.5",
  },
});
