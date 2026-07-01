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
import { fetchDailyReport } from "../actions/reportActions";
import colors from "../styles/color";
import DailyReportModal from "../components/DailyReportModal";

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isFirst = useSelector((state) => state.auth.isFirst);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [reportData, setReportData] = useState(null);

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

          if (viewedOnboarding || user?.store_name) {
            if (!viewedOnboarding && user?.store_name) {
              await AsyncStorage.setItem("@viewedOnboarding", "true");
            }
            dispatch(signInSuccess({ token, user }));
            await dispatch(loadCustomersFromStorage());
            dispatch(getAllCustomer());
            dispatch(fetchTreatmentsThunk());
          } else {
            // store_name도 없는 온보딩 미완료 신규 유저
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

  useEffect(() => {
    if (isBootstrapping) return;
    if (!isAuth) return;

    const loadReport = async () => {
      try {
        const report = await dispatch(fetchDailyReport());
        if (report) setReportData(report);
      } catch (e) {}
    };

    loadReport();
  }, [isAuth, isBootstrapping]);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        {isAuth ? (
          <MainNavigator />
        ) : isFirst ? (
          <OnboardingNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>

      <DailyReportModal
        reportData={reportData}
        onClose={() => setReportData(null)}
      />
    </>
  );
};

export default AppNavigator;
