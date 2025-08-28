import { apiClient } from "../constants/baseURL";
import { registerSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCustomers } from "../store/customerSlice";

export const registerCustomer = ({ user_id, name, phone_number, detail }) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.post(`/customers/`, {
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
      const response = await apiClient.put(`/customers/${customer_id}`, {
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

export const getCustomerbyId = (customerId) => {
  return async (dispatch) => {
    try {
      const customerResponse = await apiClient.get(`/customers/${customerId}`);
      const saleResponse = await apiClient.get(
        `/sales/by_customer/${customerId}`
      );

      return { ...customerResponse.data, sales: saleResponse.data }; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const getAllCustomer = () => {
  return async (dispatch) => {
    try {
      const response = await apiClient.get("/customers/");
      dispatch(setCustomers(response.data));
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
};

export const deleteCustomerById = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.delete(`/customers/${customerId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};
