import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";

const Input = (props) => {
  const {
    label,
    secureTextEntry,
    id,
    onPressIcon,
    errorText,
    useBlur = true, // ← 기본값 true
    ...restProps
  } = props;

  const [secure, setSecure] = useState(secureTextEntry);

  const Container = useBlur ? BlurView : View;

  return (
    <View style={styles.container}>
      <Container
        style={[styles.inputContainer, useBlur && commonStyles.blurView]}
        {...(useBlur && { tint: "xlight", intensity: 30 })}
      >
        <Text style={styles.inputTitle}>{label}</Text>

        <TextInput
          {...restProps}
          style={styles.input}
          secureTextEntry={secure}
        />

        {id === "password" && (
          <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
            <MaterialCommunityIcons
              name={secure ? "eye" : "eye-off"}
              size={24}
              color={colors.purple}
            />
          </TouchableOpacity>
        )}

        {id === "address" && (
          <TouchableOpacity onPress={onPressIcon}>
            <Ionicons name="search" size={24} color={colors.purple} />
          </TouchableOpacity>
        )}
      </Container>

      {errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
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
    textAlign: "right",
  },
});
