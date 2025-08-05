import axios from "axios";
import { BASE_URL } from "../constants/baseURL";

// thunk
export const postSaleThunk = (saleData) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/sales/`, saleData);
    return response.data;
  } catch (error) {
    console.error("Sale post error:", error);
    throw error;
  }
};

export const updateSaleThunk = (saleData) => async (dispatch) => {
  try {
    const response = await axios.put(`${BASE_URL}/sales/`, saleData);
    return response.data;
  } catch (error) {
    console.error("Sale post error:", error);
    throw error;
  }
};

export const getSalesByDate = async (dateString) => {
  try {
    console.log("getSalesByDate 호출됨", dateString); // ✅ 확인용
    const response = await axios.get(`${BASE_URL}/sales/by_date`, {
      params: { date: dateString },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSaleById = (saleId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/sales/${saleId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const deleteSaleById = (saleId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/sales/${saleId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};
