import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import { onboardingSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";

const Done = ({ ...props }) => (
  <TouchableOpacity style={styles.buttonContainer} {...props}>
    <Text style={styles.buttonText}>완료</Text>
  </TouchableOpacity>
);

const Skip = ({ ...props }) => (
  <TouchableOpacity style={styles.buttonContainer} {...props}>
    <Text style={styles.buttonText}>건너뛰기</Text>
  </TouchableOpacity>
);

const Next = ({ ...props }) => (
  <TouchableOpacity style={styles.buttonContainer} {...props}>
    <Text style={styles.buttonText}>다음</Text>
  </TouchableOpacity>
);

const OnboardingScreen = () => {
  const dispatch = useDispatch();
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("@viewedOnboarding", "true");
      dispatch(onboardingSuccess());
    } catch (e) {
      console.error("온보딩 상태 저장에 실패했습니다.", e);
      dispatch(onboardingSuccess());
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Onboarding
        onSkip={handleDone}
        onDone={handleDone}
        DoneButtonComponent={Done}
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        bottomBarColor={colors.backgroundPurple}
        bottomBarHeight={60}
        pages={[
          {
            backgroundColor: colors.lightPurple,
            image: (
              <Image
                source={require("../assets/Gopssl.png")}
                style={styles.image}
              />
            ),
            title: "Gopssl에 오신 것을 환영합니다!",
            subtitle: "고객과 매출을 손쉽게 관리하고 분석하세요.",
          },
          {
            backgroundColor: colors.secondPurple,
            image: <View style={styles.placeholderImage} />, // TODO: 매출 관리 설명 이미지 추가
            title: "일일 매출 관리",
            subtitle: "날짜별로 매출을 등록하고 한눈에 확인하세요.",
          },
          {
            backgroundColor: colors.green,
            image: <View style={styles.placeholderImage} />, // TODO: 고객 관리 설명 이미지 추가
            title: "체계적인 고객 관리",
            subtitle:
              "고객 정보를 등록하고 방문 및 시술 기록을 관리할 수 있습니다.",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  title: { fontFamily: "nanumSquareEB", fontSize: normalizeFont(24) },
  subtitle: { fontFamily: "nanumSquareB", fontSize: normalizeFont(16) },
  image: { width: 200, height: 100, resizeMode: "contain" },
  placeholderImage: { width: 200, height: 200, backgroundColor: "#fff3" },
  buttonContainer: { marginHorizontal: 15 },
  buttonText: {
    fontSize: normalizeFont(16),
    color: colors.purple,
    fontFamily: "nanumSquareB",
  },
});
