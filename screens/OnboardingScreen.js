import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/color";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { onboardingSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";

const NavButton = ({ label, ...props }) => (
  <TouchableOpacity style={styles.buttonContainer} {...props}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const Done = (props) => <NavButton label="시작하기" {...props} />;
const Skip = (props) => <NavButton label="건너뛰기" {...props} />;
const Next = (props) => <NavButton label="다음" {...props} />;

// 슬라이드 일러스트: 흰 원형 배지 안에 로고 또는 아이콘
const Badge = ({ children }) => <View style={styles.badge}>{children}</View>;

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
        imageContainerStyles={styles.imageContainer}
        bottomBarColor="#fff"
        bottomBarHeight={64}
        bottomBarHighlight={false}
        pages={[
          {
            backgroundColor: colors.purple,
            image: (
              <Badge>
                <Image
                  source={require("../assets/Gopssl.png")}
                  style={styles.logo}
                />
              </Badge>
            ),
            title: "Gopssl에 오신 걸 환영합니다",
            subtitle: "미용실 매출과 고객을\n한 곳에서 관리하세요",
          },
          {
            backgroundColor: colors.lightPurple,
            image: (
              <Badge>
                <Ionicons
                  name="bar-chart"
                  size={normalizeSize(56)}
                  color={colors.purple}
                />
              </Badge>
            ),
            title: "일일 매출 관리",
            subtitle: "날짜별로 매출을 기록하고\n추이를 한눈에 확인해요",
          },
          {
            backgroundColor: colors.green,
            image: (
              <Badge>
                <Ionicons
                  name="people"
                  size={normalizeSize(56)}
                  color={colors.green}
                />
              </Badge>
            ),
            title: "체계적인 고객 관리",
            subtitle: "고객별 방문 기록과\n시술 이력을 쌓아가요",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  imageContainer: {
    paddingBottom: normalizeSize(24),
  },
  badge: {
    width: normalizeSize(150),
    height: normalizeSize(150),
    borderRadius: normalizeSize(75),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: normalizeSize(96),
    height: normalizeSize(48),
    resizeMode: "contain",
  },
  title: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(24),
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
    marginTop: normalizeSize(8),
  },
  subtitle: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(15),
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: normalizeFont(24),
    opacity: 0.92,
    paddingHorizontal: normalizeSize(24),
  },
  buttonContainer: {
    paddingHorizontal: normalizeSize(16),
    paddingVertical: normalizeSize(8),
  },
  buttonText: {
    fontSize: normalizeFont(15),
    color: colors.purple,
    fontFamily: "nanumSquareB",
    letterSpacing: -0.5,
  },
});
