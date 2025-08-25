import React from "react";
import { StyleSheet, TextInput } from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { normalizeFont } from "../../utils/responsive";

const DetailInput = ({
  value,
  onChangeText,
  onFocus,
  inputProps = {},
  ...rest
}) => {
  return (
    <BaseInput {...rest} portraitMode={true} onFocus={onFocus}>
      <TextInput
        placeholder="고객님을 기억하기 위한 어떠한 것이든 입력해주세요."
        style={styles.detail}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
        onFocus={(e) => {
          onFocus && onFocus(e);
          // 기존에 inputProps나 rest에 있던 onFocus도 호출
          inputProps.onFocus && inputProps.onFocus(e);
          rest.onFocus && rest.onFocus(e);
        }}
        {...inputProps}
      />
    </BaseInput>
  );
};

export default DetailInput;

const styles = StyleSheet.create({
  detail: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 8,
    padding: 16,
    fontSize: normalizeFont(12),
    fontFamily: "nanumSquareR",
    alignSelf: "center",
  },
});
