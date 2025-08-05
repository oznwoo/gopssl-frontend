import React from "react";
import { StyleSheet, TextInput } from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";

const DetailInput = ({ value, onChangeText, ...rest }) => {
  return (
    <BaseInput {...rest} portraitMode={true}>
      <TextInput
        placeholder="고객님을 기억하기 위한 어떠한 것이든 입력해주세요."
        style={styles.detail}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
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
    fontSize: 12,
    fontFamily: "nanumSquareR",
    alignSelf: "center",
  },
});
