import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const SettingItem = (props) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={props.onPress}>
      {props.icon}
      <Text style={styles.settingText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  settingItem: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.backgroundPurple,
    flexDirection: "row",
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: {
    flex: 1,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
    letterSpacing: -1,
    color: colors.purple,
  },
});
