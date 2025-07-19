import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import colors from "../styles/color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Input = (props) => {
  const [secure, setSecure] = useState(true);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputTitle}>{props.title}</Text>
      <TextInput {...props} style={styles.input} secureTextEntry={secure} />
      {props.title === "비밀번호" && (
        <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
          <MaterialCommunityIcons
            name={secure ? "eye" : "eye-off"}
            size={24}
            color={colors.purple}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: 16,
  },
});
