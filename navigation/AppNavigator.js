import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInSuccess, logout as logoutAction } from "../store/authSlice";
import { getAllCustomer } from "../actions/customerActions";
import { ActivityIndicator, Text, View } from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isFirst = useSelector((state) => state.auth.isFirst);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");

        if (token && user) {
          // 토큰 만료 여부는 서버 요청 시 확인
          dispatch(signInSuccess({ token, user: JSON.parse(user) }));
          dispatch(getAllCustomer());
        }
      } catch (e) {
        console.log("자동 로그인 실패:", e);
        // 혹시 오류 발생 시 안전하게 로그아웃 처리
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        dispatch(logoutAction());
      } finally {
        setLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  // 로딩 중에는 스플래시 화면이나 ActivityIndicator 표시 가능
  if (loading)
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ActivityIndicator color={colors.purple} size={48} />
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "nanumSquareB",
            fontSize: normalizeFont(20),
            letterSpacing: -0.5,
            color: colors.purple,
          }}
        >
          자동 로그인 진행 중...
        </Text>
      </View>
    );

  return (
    <NavigationContainer>
      {isAuth && !isFirst ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
