import React from "react";
import { TextInput, View, Text, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import colors from "../../styles/color";
import { commonStyles } from "../../styles/commonStyles";
import { normalizeFont } from "../../utils/responsive";

const BaseInput = ({
  label,
  useBlur = true,
  errorText,
  portraitMode = false,
  rightIcon,
  children,
  inputProps = {},
  specialButton,
  textStyle,
  onFocus,
  ...rest
}) => {
  const Container = useBlur ? BlurView : View;

  return (
    <View style={styles.container}>
      <Container
        style={[
          styles.inputContainer,
          Platform.OS === "ios" || portraitMode
            ? { paddingVertical: 10 }
            : { paddingVertical: 4 },
          useBlur && commonStyles.blurView,
          portraitMode && styles.portraitMode,
        ]}
        {...(useBlur && { tint: "xlight", intensity: 30 })}
      >
        {label && <Text style={styles.inputTitle}>{label}</Text>}

        {children ? (
          children
        ) : (
          <TextInput
            style={[styles.input, textStyle]}
            {...rest}
            {...inputProps}
            onFocus={(e) => {
              // 부모 컴포넌트에서 전달된 onFocus 먼저 호출
              onFocus && onFocus(e);
              // 기존에 inputProps나 rest에 있던 onFocus도 호출
              inputProps.onFocus && inputProps.onFocus(e);
              rest.onFocus && rest.onFocus(e);
            }}
          />
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

    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  inputTitle: {
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
  },
  errorContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  errorText: {
    fontSize: normalizeFont(12),
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
