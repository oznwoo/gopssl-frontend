import axios from "axios";
import { BASE_URL } from "../constants/baseURL";

export const getDailySalesSummary = async (year, month) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sales/statistics/summary/daily`,
      {
        params: { year, month },
      }
    );
    return response.data; // { "2025-08-01": 120000, ... }
  } catch (error) {
    console.error("getDailySalesSummary error:", error);
    throw error;
  }
};

export const getMonthlySalesSummary = async (year, month) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sales/statistics/summary/monthly`,
      {
        params: { year, month },
      }
    );
    return response.data; // { "2025-08-01": 120000, ... }
  } catch (error) {
    console.error("getMonthlySalesSummary error:", error);
    throw error;
  }
};
