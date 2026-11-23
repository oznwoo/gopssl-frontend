import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { normalizeFont } from "../../utils/responsive";

// 주소 칸.
// - 평소(manual=false): 읽기 전용. 칸 어디를 눌러도 검색 화면으로 이동
// - 검색 실패 후 "직접 입력"(manual=true): 타이핑 가능, 검색 아이콘으로 다시 검색 가능
const AddressSearchInput = ({
  value,
  onChangeText,
  onPressSearch,
  manual = false,
  placeholder = "눌러서 주소 검색",
  ...rest
}) => {
  const searchIcon = (
    <TouchableOpacity onPress={onPressSearch} hitSlop={8}>
      <Ionicons name="search" size={24} color={colors.purple} />
    </TouchableOpacity>
  );

  if (manual) {
    return (
      <BaseInput
        {...rest}
        inputProps={{ value, onChangeText, placeholder: "주소를 직접 입력" }}
        rightIcon={searchIcon}
      />
    );
  }

  return (
    <Pressable onPress={onPressSearch} accessibilityRole="button">
      <BaseInput
        {...rest}
        rightIcon={<Ionicons name="search" size={24} color={colors.purple} />}
      >
        <Text
          style={[styles.valueText, !value && styles.placeholder]}
          numberOfLines={2}
        >
          {value || placeholder}
        </Text>
      </BaseInput>
    </Pressable>
  );
};

export default AddressSearchInput;

const styles = StyleSheet.create({
  valueText: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
    color: "#000",
  },
  placeholder: {
    color: "#A9A9B2",
  },
});
