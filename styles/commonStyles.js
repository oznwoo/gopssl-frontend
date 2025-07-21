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

  blurView: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // 글래스 효과용 반투명 배경
    overflow: "hidden", // BlurView가 둥근 모서리 안에 머물도록
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
  },
});
