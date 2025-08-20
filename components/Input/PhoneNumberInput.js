import React, { useEffect, useState } from "react";
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
import { normalizeFont } from "../../utils/responsive";

const prefixes = ["010", "031", "02"];

const PhoneNumberInput = ({ onChangePhoneNumber, value, ...rest }) => {
  const [prefix, setPrefix] = useState("010");
  const [middle, setMiddle] = useState("");
  const [last, setLast] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // value prop이 바뀔 때마다 상태 업데이트
  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setPrefix(parts[0]);
        setMiddle(parts[1]);
        setLast(parts[2]);
      }
    }
  }, [value]);

  const handleChange = (part, value) => {
    if (part === "middle") setMiddle(value);
    else if (part === "last") setLast(value);

    const full = `${prefix}-${part === "middle" ? value : middle}-${
      part === "last" ? value : last
    }`;
    onChangePhoneNumber?.(full);
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
    fontSize: normalizeFont(14),
    fontFamily: "nanumSquareR",
    letterSpacing: -0.5,
    color: colors.purple,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.grayLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 60,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
    textAlign: "center",
  },
  hyphen: {
    fontSize: normalizeFont(16),
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
    fontSize: normalizeFont(14),
    letterSpacing: -0.5,
    fontFamily: "nanumSquareEB",
    color: "#fff",
  },
});
