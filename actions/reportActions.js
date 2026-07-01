import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../constants/baseURL";
import { store } from "../store/store";
import { getAllCustomer } from "./customerActions";

const getLastReportDateKey = () => {
  const userId = store.getState().auth.user?.id;
  return `@lastReportDate_${userId}`;
};

export const fetchDailyReport = () => {
  return async (dispatch) => {
    const key = getLastReportDateKey();
    const today = new Date().toISOString().split("T")[0];
    const lastReportDate = await AsyncStorage.getItem(key);

    if (lastReportDate === today) {
      apiClient.delete("/customers/cleanup/inactive")
        .then(() => dispatch(getAllCustomer()))
        .catch(() => {});
      return null;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const [salesRes, cleanupRes] = await Promise.all([
      apiClient.get(`/sales/by_date?date=${yesterdayStr}`),
      apiClient.delete("/customers/cleanup/inactive"),
    ]);

    const sales = salesRes.data;

    dispatch(getAllCustomer());

    await AsyncStorage.setItem(key, today);

    return {
      date: yesterdayStr,
      totalAmount: sales.reduce((acc, s) => acc + (s.total_amount || 0), 0),
      visitCount: sales.length,
      cashCount: sales.filter((s) => s.payment_type === "현금").length,
      cardCount: sales.filter((s) => s.payment_type === "카드").length,
      deletedCustomers: cleanupRes.data.deleted_customers || [],
    };
  };
};
