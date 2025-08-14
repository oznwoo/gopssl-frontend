import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import colors from "../../styles/color";
import { commonStyles } from "../../styles/commonStyles";

const BaseInput = ({
  label,
  useBlur = true,
  errorText,
  portraitMode = false,
  rightIcon,
  children,
  inputProps = {},
  specialButton,
  ...rest
}) => {
  const Container = useBlur ? BlurView : View;

  return (
    <View style={styles.container}>
      <Container
        style={[
          styles.inputContainer,
          useBlur && commonStyles.blurView,
          portraitMode && styles.portraitMode,
        ]}
        {...(useBlur && { tint: "xlight", intensity: 30 })}
      >
        {label && <Text style={styles.inputTitle}>{label}</Text>}

        {children ? (
          children
        ) : (
          <TextInput style={styles.input} {...rest} {...inputProps} />
        )}

        {rightIcon}

        {specialButton}
      </Container>

      {errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
};

export default BaseInput;

const styles = StyleSheet.create({
  container: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "#fff",
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
  portraitMode: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: 16,
  },
});
