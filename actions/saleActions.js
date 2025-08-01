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
