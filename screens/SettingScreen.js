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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useDispatch, useSelector } from "react-redux";
import { logout, deleteAccount } from "../actions/authActions";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logoURL from "../assets/Gopssl.png";
import SettingItem from "../components/SettingItem";

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

  const handleLogout = () => {
    try {
      setIsLoading(true);
      dispatch(logout());
    } catch (error) {
      console.error(error);
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
        <Text style={styles.dDayText}>개업일로부터 D+1000 🎉</Text>
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
              title={"상세 정보"}
              icon={
                <FontAwesome6
                  name="circle-exclamation"
                  size={16}
                  color={colors.purple}
                />
              }
              onPress={() => handleNavigate("Detail")}
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
  deleteAccountContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  deleteAccountText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(13),
    letterSpacing: -0.5,
    color: colors.lightPurple,
    textDecorationLine: "underline",
  },
});
