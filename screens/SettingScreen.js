import React, { useState } from "react";
import {
  ActivityIndicator,
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/authActions";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingScreen = (props) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { name } = useSelector((state) => state.auth.user);

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleDetail = () => {
    navigation.navigate("Detail");
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.horizontalLine}></View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Gopssl</Text>
          <Text style={styles.userName}>
            <Text style={{ fontFamily: "gamtanDotumB" }}>{name}</Text> 원장님
          </Text>
        </View>

        <View style={styles.settingContainer}>
          <TouchableOpacity style={styles.settingItem} onPress={handleProfile}>
            <Ionicons name="person" size={20} color={colors.purple} />
            <Text style={styles.settingText}>계정</Text>
            <FontAwesome5
              name="chevron-right"
              size={20}
              color={colors.purple}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleDetail}>
            <FontAwesome6
              name="circle-exclamation"
              size={20}
              color={colors.purple}
            />
            <Text style={styles.settingText}>상세정보</Text>
            <FontAwesome5
              name="chevron-right"
              size={20}
              color={colors.purple}
            />
          </TouchableOpacity>

          <View style={{ marginTop: 36 }}>
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
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 0,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",

    paddingTop: 12,
    padding: 24,
  },
  headerTitle: {
    textAlign: "center",
    color: colors.purple,
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(20),
    letterSpacing: -0.5,
  },
  horizontalLine: {
    width: "120%",
    zIndex: 20,
    position: "absolute",
    top: normalizeSize(56),
    height: 2,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    gap: 180,
    padding: 32,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  logo: {
    width: "100%",
    fontFamily: "logo",
    fontSize: normalizeFont(80),
    color: colors.purple,
    height: normalizeFont(140),
    textAlign: "center",
  },
  userName: {
    fontFamily: "gamtanDotumR",
    fontSize: normalizeFont(24),
    letterSpacing: -0.5,
    lineHeight: 32,
    color: colors.purple,
  },
  settingContainer: {
    width: "100%",
    gap: 24,
  },
  settingItem: {
    width: "100%",
    backgroundColor: "#fff",

    flexDirection: "row",
    padding: 20,
    borderRadius: 12,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    ...commonStyles.dropShadow,
  },
  settingText: {
    flex: 1,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.purple,
  },
});
