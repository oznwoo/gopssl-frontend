// styles/commonStyles.js
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  textBold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dropShadow: {
    // iOS 전용 shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android 전용 shadow
    elevation: 5,
  },
});
