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
import Ionicons from "@expo/vector-icons/Ionicons";

const Input = (props) => {
  const [secure, setSecure] = useState(props.secureTextEntry);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>{props.label}</Text>
        <TextInput {...props} style={styles.input} secureTextEntry={secure} />
        {props.id === "password" && (
          <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
            <MaterialCommunityIcons
              name={secure ? "eye" : "eye-off"}
              size={24}
              color={colors.purple}
            />
          </TouchableOpacity>
        )}
        {props.id === "address" && (
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="search" size={24} color={colors.purple} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.errorContainer}>
        {props.errorText && (
          <Text style={styles.errorText}>{props.errorText}</Text>
        )}
      </View>
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
  errorContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  errorText: {
    color: colors.alert,
    fontFamily: "nanumSquareR",
    letterSpacing: -0.5,
  },
});
