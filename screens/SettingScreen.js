import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../styles/color";
import SubmitButton from "../components/SubmitButton";
import { commonStyles } from "../styles/commonStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useDispatch, useSelector } from "react-redux";
import { logout, deleteAccount } from "../actions/authActions";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logoURL from "../assets/Gopssl.png";
import SettingItem from "../components/SettingItem";
import { describeError } from "../utils/describeError";
import { requestHomeTour } from "../store/tourSlice";
import * as Application from "expo-application";

// 설정 화면 맨 아래에 작게 보여 줄 앱 버전. 예: "앱 버전 1.1.0 (5)"
// 설치된 앱에서 읽으므로 내부 테스트 때 폰에 어떤 빌드가 깔렸는지 Play Console과 바로 비교할 수 있다.
// - nativeApplicationVersion: app.json의 version (사용자용)
// - nativeBuildVersion: EAS가 빌드마다 1씩 올리는 versionCode / buildNumber
// Expo Go 등에서 값이 없으면 있는 것만 보여 준다.
const VERSION_LABEL = (() => {
  const name = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;
  if (!name) return "";
  return build ? `앱 버전 ${name} (${build})` : `앱 버전 ${name}`;
})();

const SettingScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // 탈퇴 직후 user가 null이 되어도 화면이 전환되기 전까지 깨지지 않도록
  const name = useSelector((state) => state.auth.user?.name);

  const handleNavigate = (target) => {
    navigation.navigate(target);
  };

  // 홈 탭으로 이동한 뒤 기능 안내를 처음부터 다시 띄운다 (이미 본 사용자도)
  const handleReplayGuide = () => {
    dispatch(requestHomeTour({ replay: true }));
    navigation.navigate("DailySales");
  };

  const handleLogout = () => {
    try {
      setIsLoading(true);
      dispatch(logout());
    } catch (error) {
      console.error(describeError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const runDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // 성공하면 로그아웃 상태가 되어 로그인 화면으로 넘어간다
      await dispatch(deleteAccount());
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("탈퇴 실패", error.message);
    }
  };

  // 되돌릴 수 없는 삭제라 확인을 두 번 받는다: 무엇이 지워지는지 안내 → 최종 확인
  const handleDeleteAccount = () => {
    if (isDeleting) return;
    Alert.alert(
      "회원 탈퇴 안내",
      "탈퇴하시면 원장님 계정과 함께 등록하신 손님 정보, 매출 기록, 시술 목록이 모두 삭제됩니다.\n\n삭제된 기록은 다시 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "계속",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "정말 탈퇴하시겠어요?",
              "확인을 누르시면 바로 계정과 모든 기록이 삭제됩니다.",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "탈퇴하기",
                  style: "destructive",
                  onPress: runDeleteAccount,
                },
              ],
            ),
        },
      ],
    );
  };

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <Image source={logoURL} style={styles.logo} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          <Text style={{ fontFamily: "nanumSquareEB" }}>{name}</Text> 원장님
        </Text>
        {/* 개업일 D-day는 아직 개업일 입력 기능이 없어 고정값(D+1000)만 보여서 숨김. 기능 개발 후 복구 */}
        {/* <Text style={styles.dDayText}>개업일로부터 D+1000 🎉</Text> */}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.settingContainer}>
          <Text
            style={{
              fontFamily: "nanumSquareB",
              fontSize: normalizeFont(16),
              letterSpacing: -1,
              color: colors.purple,
              borderBottomColor: colors.purple,
              borderBottomWidth: 1,
              paddingBottom: 8,
              paddingLeft: 8,
            }}
          >
            설정
          </Text>
          <View style={styles.settingContainer}>
            <SettingItem
              title={"프로필"}
              icon={<Ionicons name="person" size={16} color={colors.purple} />}
              onPress={() => handleNavigate("Profile")}
            />
            <SettingItem
              title={"시술 관리"}
              icon={
                <Fontisto name="scissors" size={16} color={colors.purple} />
              }
              onPress={() => handleNavigate("Treatment")}
            />
            <SettingItem
              title={"삭제된 고객"}
              icon={
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.purple}
                />
              }
              onPress={() => handleNavigate("DeletedCustomers")}
            />
            <SettingItem
              title={"사용 가이드 다시 보기"}
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={16}
                  color={colors.purple}
                />
              }
              onPress={handleReplayGuide}
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.alert}
              style={{ marginTop: 10 }}
            />
          ) : (
            <SubmitButton title="로그아웃" onDelete={handleLogout} />
          )}
        </View>
        <View style={styles.deleteAccountContainer}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.lightPurple} />
          ) : (
            <TouchableOpacity onPress={handleDeleteAccount} hitSlop={8}>
              <Text style={styles.deleteAccountText}>회원 탈퇴</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.versionText}>{VERSION_LABEL}</Text>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  logoContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    gap: 8,
    width: "100%",
  },
  logo: {
    width: normalizeSize(100),
    height: normalizeSize(50),
    resizeMode: "contain",
  },
  userInfo: {
    paddingHorizontal: 8,
    marginHorizontal: 12,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    ...commonStyles.dropShadow,
  },
  userName: {
    alignSelf: "flex-start",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(18),
    letterSpacing: -1,
    lineHeight: 32,
    color: colors.purple,
  },
  dDayText: {
    fontFamily: "nanumSquareB",
    color: colors.alert,
    letterSpacing: -1,
  },
  settingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 12,
    width: "100%",
    gap: 8,
  },
  // contentContainer의 gap(12)이 이미 위아래 간격을 만들어 주므로 여백은 최소로 둔다
  // (로그아웃 ↔ 회원 탈퇴 ↔ 앱 버전을 한 묶음처럼 보이게)
  deleteAccountContainer: {
    alignItems: "center",
    paddingTop: 4,
  },
  deleteAccountText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(13),
    letterSpacing: -0.5,
    color: colors.lightPurple,
    textDecorationLine: "underline",
  },
  versionText: {
    textAlign: "center",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
    letterSpacing: -0.3,
    color: colors.lightPurple,
  },
});
