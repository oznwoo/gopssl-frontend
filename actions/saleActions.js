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
