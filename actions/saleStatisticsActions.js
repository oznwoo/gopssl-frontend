import { apiClient } from "../constants/baseURL";

export const getDailySalesSummary = async (year, month) => {
  try {
    const response = await apiClient.get(`/sales/statistics/summary/daily`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("getDailySalesSummary error:", error);
    throw error;
  }
};

export const getMonthlySalesSummary = async (year, month) => {
  try {
    const response = await apiClient.get(`/sales/statistics/summary/monthly`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("getMonthlySalesSummary error:", error);
    throw error;
  }
};
