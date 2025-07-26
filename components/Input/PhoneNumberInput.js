import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";

const prefixes = ["010", "031", "02"];

const PhoneNumberInput = ({ onChangePhoneNumber, ...rest }) => {
  const [prefix, setPrefix] = useState("010");
  const [middle, setMiddle] = useState("");
  const [last, setLast] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (part, value) => {
    if (part === "middle") setMiddle(value);
    else if (part === "last") setLast(value);

    const full = `${prefix}-${part === "middle" ? value : middle}-${
      part === "last" ? value : last
    }`;
    onChangePhoneNumber?.(full);
  };

  const handlePrefixChange = (selected) => {
    setPrefix(selected);
    // 현재 상태 기준 전체 번호 업데이트
    onChangePhoneNumber?.(`${selected}-${middle}-${last}`);
  };

  return (
    <>
      <BaseInput {...rest} portraitMode={true}>
        <View style={styles.wrapper}>
          <View>
            <TouchableOpacity
              style={styles.prefixBox}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.prefixText}>{prefix} ▼</Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdown}>
                {prefixes.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setPrefix(item);
                      setShowDropdown(false);
                      onChangePhoneNumber?.(`${item}-${middle}-${last}`);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <Text style={styles.hyphen}>-</Text>
          <TextInput
            keyboardType="numeric"
            maxLength={4}
            style={styles.input}
            value={middle}
            onChangeText={(val) => handleChange("middle", val)}
          />
          <Text style={styles.hyphen}>-</Text>
          <TextInput
            keyboardType="numeric"
            maxLength={4}
            style={styles.input}
            value={last}
            onChangeText={(val) => handleChange("last", val)}
          />
        </View>
      </BaseInput>
    </>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  prefixBox: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  prefixText: {
    fontSize: 14,
    fontFamily: "nanumSquareR",
    letterSpacing: "-0.5",
    color: colors.purple,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.grayLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 60,
    fontFamily: "nanumSquareR",
    fontSize: 16,
    textAlign: "center",
  },
  hyphen: {
    fontSize: 16,
    color: colors.grayDark,
  },
  dropdown: {
    position: "absolute",
    top: 42,
    left: 0,
    backgroundColor: colors.purple,
    borderRadius: 6,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 14,
    letterSpacing: "-0.5",
    fontFamily: "nanumSquareEB",
    color: "#fff",
  },
});
