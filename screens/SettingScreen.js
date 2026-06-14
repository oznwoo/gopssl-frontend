import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../styles/color";
import SubmitButton from "../components/SubmitButton";
import { commonStyles } from "../styles/commonStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/authActions";
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
  const { name } = useSelector((state) => state.auth.user);

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
});
