// src/actions/treatmentActions.js
import { apiClient } from "../constants/baseURL";
import {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
} from "../store/treatmentSlice";

export const fetchTreatmentsThunk = () => async (dispatch) => {
  dispatch(fetchTreatmentsStart());

  try {
    const response = await apiClient.get(`/treatments/`);
    dispatch(fetchTreatmentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTreatmentsFailure(error.message));
  }
};

export const getTreatmentbyId = (treatmentId) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.get(`/treatments/${treatmentId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};

export const createTreatment =
  ({ name, category, default_price }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.post(`/treatments/`, {
        name,
        category,
        default_price,
      });
      return response.data;
    } catch (error) {
      console.error("Treatment post error:", error);
      throw error;
    }
  };

export const updateTreatment =
  ({ treatmentId, name, category, default_price }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.put(`/treatments/${treatmentId}`, {
        name,
        category,
        default_price,
      });
      return response.data;
    } catch (error) {
      console.error("Treatment post error:", error);
      throw error;
    }
  };

export const deleteTreatment = (treatmentId) => {
  return async (dispatch) => {
    try {
      const response = await apiClient.delete(`/treatments/${treatmentId}`);

      return response.data; // 결과 반환 (optional)
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e; // ⬅️ 호출한 곳에서 catch 가능하게
    }
  };
};
