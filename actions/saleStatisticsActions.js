import { apiClient } from "../constants/baseURL";
import { describeError } from "../utils/describeError";

export const getDailySalesSummary = async (year, month) => {
  try {
    const response = await apiClient.get(`/sales/statistics/summary/daily`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("getDailySalesSummary error:", describeError(error));
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
    console.error("getMonthlySalesSummary error:", describeError(error));
    throw error;
  }
};
