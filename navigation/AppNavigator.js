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
import { setCustomers } from "../store/customerSlice";

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");

        if (token && user) {
          // 1. AsyncStorage의 정보로 우선 로그인 처리
          dispatch(signInSuccess({ token, user: JSON.parse(user) }));

          // 2. 고객 정보 처리
          const localCustomers = await AsyncStorage.getItem("customers");
          if (localCustomers) {
            // 2-1. 로컬 데이터가 있으면 먼저 화면에 보여줌 (UX 향상)
            dispatch(setCustomers(JSON.parse(localCustomers)));
          }

          // 3. 항상 서버에서 최신 고객 정보를 가져와 업데이트 (데이터 동기화)
          // 로컬 데이터가 없으면 새로 가져오고, 있어도 최신 정보로 덮어쓰게 됨
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
      {isAuth ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
