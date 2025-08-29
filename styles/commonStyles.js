// styles/commonStyles.js
import { StyleSheet } from "react-native";
import { normalizeFont } from "../utils/responsive";

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
    fontSize: normalizeFont(16),
  },
  lightDropShadow: {
    // iOS 전용 shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    // Android 전용 shadow
    elevation: 1,
  },

  dropShadow: {
    // iOS 전용 shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    // Android 전용 shadow
    elevation: 10,
  },

  blurView: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // 글래스 효과용 반투명 배경
    overflow: "hidden", // BlurView가 둥근 모서리 안에 머물도록
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
  },
});
