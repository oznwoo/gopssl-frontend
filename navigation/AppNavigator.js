import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInSuccess, signUpSuccess } from "../store/authSlice";
import { getAllCustomer, loadCustomersFromStorage } from "../actions/customerActions";
import { fetchTreatmentsThunk } from "../actions/treatmentActions";
import { apiClient } from "../constants/baseURL";
import colors from "../styles/color";

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isFirst = useSelector((state) => state.auth.isFirst);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [token, userJson, viewedOnboarding] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("@viewedOnboarding"),
        ]);

        if (token && userJson) {
          const user = JSON.parse(userJson);

          if (viewedOnboarding) {
            dispatch(signInSuccess({ token, user }));
            await dispatch(loadCustomersFromStorage());
            dispatch(getAllCustomer());
            dispatch(fetchTreatmentsThunk());
            apiClient.delete("/customers/cleanup/inactive").catch(() => {});
          } else {
            // 온보딩 미완료: InfoForm 복원
            dispatch(signUpSuccess({ token, user }));
          }
        }
      } catch (e) {
        console.error("앱 초기화 실패:", e);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuth ? (
        <MainNavigator />
      ) : isFirst ? (
        <OnboardingNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
