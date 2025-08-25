import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { normalizeFont } from "../../utils/responsive";

const TypeInput = ({ value, onChange, options = [], ...rest }) => {
  return (
    <BaseInput {...rest} portraitMode={true}>
      <View style={styles.container}>
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
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
});
