import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { normalizeFont } from "../../utils/responsive";
import { commonStyles } from "../../styles/commonStyles";

const TypeInput = ({
  value,
  onChange,
  options = [],
  toggleButtonMode = false,
  ...rest
}) => {
  return (
    <BaseInput
      {...rest}
      style={toggleButtonMode && styles.toggleButtonMode}
      portraitMode={true}
    >
      <View
        style={[
          styles.container,
          toggleButtonMode && {
            ...commonStyles.lightDropShadow,
            borderRadius: 8,
          },
        ]}
      >
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                toggleButtonMode && {
                  paddingHorizontal: 4,
                  paddingVertical: 8,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                  toggleButtonMode && styles.toggleButtonModeText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseInput>
  );
};

export default TypeInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.backgroundPurple,
  },
  optionSelected: {
    backgroundColor: colors.purple,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: normalizeFont(14),
    fontFamily: "nanumSquareR",
    color: "#000",
  },
  optionTextSelected: {
    fontFamily: "nanumSquareEB",
    color: "#fff",
  },
  toggleButtonMode: {
    minWidth: 120,
    minHeight: 64,
    zIndex: 10,
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  toggleButtonModeText: {
    fontSize: normalizeFont(8),
  },
});
