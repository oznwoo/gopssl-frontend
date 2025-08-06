import axios from "axios";
import { registerSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/baseURL";

export const registerCustomer = ({ user_id, name, phone_number, detail }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/`, {
        user_id,
        name,
        phone_number,
        detail,
      });

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const updateCustomer = ({
  customer_id,
  user_id,
  name,
  phone_number,
  detail,
}) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/customers/${customer_id}`, {
        user_id,
        name,
        phone_number,
        detail,
      });

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const getCustomer = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/${customerId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const searchCustomer = (customerName) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/search`, {
        params: {
          name: customerName,
        },
      });

      return response.data;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};

export const deleteCustomerById = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/customers/${customerId}`
      );

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};
