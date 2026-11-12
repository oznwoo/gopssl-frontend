import { apiClient } from "../constants/baseURL";
import { registerSuccess } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCustomers } from "../store/customerSlice";

export const CUSTOMER_CACHE_KEY = "customers_cache";

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
      const customers = response.data;

      // Redux 상태 업데이트
      dispatch(setCustomers(customers));

      // 디바이스 로컬(AsyncStorage)에 캐시 저장
      try {
        await AsyncStorage.setItem(
          CUSTOMER_CACHE_KEY,
          JSON.stringify(customers)
        );
      } catch (storageError) {
        console.log("고객 캐시 저장 실패:", storageError);
      }

      return customers;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
};

// 앱 시작 시: AsyncStorage에 저장된 고객 리스트를 먼저 불러오는 thunk
export const loadCustomersFromStorage = () => {
  return async (dispatch) => {
    try {
      const cached = await AsyncStorage.getItem(CUSTOMER_CACHE_KEY);
      if (!cached) return null;

      const customers = JSON.parse(cached);
      if (Array.isArray(customers)) {
        dispatch(setCustomers(customers));
      }

      return customers;
    } catch (e) {
      console.log("고객 캐시 로딩 실패:", e);
      return null;
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

export const permanentDeleteCustomer = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.delete(`/customers/${customerId}/permanent`);
      return response.data;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};

export const restoreCustomer = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.post(`/customers/${customerId}/restore`);
      return response.data;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};
