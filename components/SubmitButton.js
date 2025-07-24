import react from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import colors from "../styles/color";

const SubmitButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...styles.button,
        ...styles.purpleButton,
        ...commonStyles.dropShadow,
        opacity: props.disable ? 0.5 : 1,
      }}
    >
      <Text style={styles.purpleButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
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
});
