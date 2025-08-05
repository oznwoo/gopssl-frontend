import react from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import colors from "../styles/color";

const SubmitButton = (props) => {
  const buttonColor = props.onDelete
    ? { backgroundColor: colors.alert }
    : { backgroundColor: colors.purple };
  const buttonWidth =
    props.size === "small" ? { width: "50%" } : { width: "100%" };

  return (
    <TouchableOpacity
      onPress={props.onDelete ? props.onDelete : props.onPress}
      style={{
        ...styles.button,
        ...styles.purpleButton,
        ...commonStyles.dropShadow,
        ...buttonColor,
        ...buttonWidth,
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
