import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import { commonStyles } from "../styles/commonStyles";

const FormHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={props.onGoBack} style={styles.goBackButton}>
        <FontAwesome5 name="arrow-left" size={16} color="#fff" />
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

    paddingTop: 12,
    padding: 16,
  },
  goBackButton: {
    position: "absolute",
    top: 12,
    left: 20,
  },
  headerTitleContainer: {
    flex: 1,
    pointerEvents: "none",
  },
  headerTitle: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "nanumSquareB",
    letterSpacing: -1,
    fontSize: normalizeFont(16),
  },
});
