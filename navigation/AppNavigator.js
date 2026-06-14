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
import DailyReportModal from "../components/DailyReportModal";

const LAST_REPORT_DATE_KEY = "@lastReportDate";

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

          if (viewedOnboarding) {
            dispatch(signInSuccess({ token, user }));
            await dispatch(loadCustomersFromStorage());
            dispatch(getAllCustomer());
            dispatch(fetchTreatmentsThunk());

            const today = new Date().toISOString().split("T")[0];
            const lastReportDate = await AsyncStorage.getItem(LAST_REPORT_DATE_KEY);

            if (lastReportDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split("T")[0];

              try {
                const [salesRes, cleanupRes] = await Promise.all([
                  apiClient.get(`/sales/by_date?date=${yesterdayStr}`),
                  apiClient.delete("/customers/cleanup/inactive"),
                ]);

                const sales = salesRes.data;
                const totalAmount = sales.reduce((acc, s) => acc + (s.total_amount || 0), 0);
                const cashCount = sales.filter((s) => s.payment_type === "현금").length;
                const cardCount = sales.filter((s) => s.payment_type === "카드").length;

                setReportData({
                  date: yesterdayStr,
                  totalAmount,
                  visitCount: sales.length,
                  cashCount,
                  cardCount,
                  deletedCustomers: cleanupRes.data.deleted_customers || [],
                });

                await AsyncStorage.setItem(LAST_REPORT_DATE_KEY, today);
              } catch (e) {
                console.error("리포트 로딩 실패:", e);
              }
            } else {
              apiClient.delete("/customers/cleanup/inactive").catch(() => {});
            }
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
