import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const SectionHeader = ({ title, collapsed, onToggle }) => {
  const rotateAnim = useRef(new Animated.Value(collapsed ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: collapsed ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [collapsed]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "180deg"],
  });

  return (
    <View style={styles.sectionHeaderContainer}>
      <TouchableOpacity style={styles.sectionHeaderButton} onPress={onToggle}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <Animated.View
          style={{ transform: [{ rotate }], position: "relative", top: 4 }}
        >
          <Ionicons name="triangle" size={8} color={colors.purple} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundPurple,
    borderRadius: 4,
  },
  sectionHeaderButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  sectionHeaderText: {
    fontSize: normalizeFont(14),
    fontFamily: "nanumSquareEB",
    color: colors.purple,
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 16,
  },
});
