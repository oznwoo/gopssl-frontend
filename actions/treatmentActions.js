// src/actions/treatmentActions.js
import { apiClient } from "../constants/baseURL";
import {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
  fetchTreatmentCategoriesSuccess,
  addTreatment,
  updateTreatmentSuccess,
  deleteTreatmentSuccess,
} from "../store/treatmentSlice";

// 📌 전체 조회 (시술 + 카테고리)
export const fetchTreatmentsThunk = () => async (dispatch) => {
  dispatch(fetchTreatmentsStart());

  try {
    const response1 = await apiClient.get(`/treatments/`);
    dispatch(fetchTreatmentsSuccess(response1.data));

    const response2 = await apiClient.get(`/categories/`);
    dispatch(fetchTreatmentCategoriesSuccess(response2.data));
  } catch (error) {
    dispatch(fetchTreatmentsFailure(error.message));
  }
};

// 📌 단일 시술 조회
export const getTreatmentbyId = (treatmentId) => {
  return async () => {
    try {
      const response = await apiClient.get(`/treatments/${treatmentId}`);
      return response.data;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};

// 📌 시술 등록
export const createTreatment =
  ({ name, category_id, default_price }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.post(`/treatments/`, {
        name,
        category_id,
        default_price,
      });

      // Redux 상태 즉시 반영
      dispatch(addTreatment(response.data));

      return response.data;
    } catch (error) {
      console.error("Treatment post error:", error);
      throw error;
    }
  };

// 📌 시술 수정
export const updateTreatment =
  ({ treatment_id, name, category_id, default_price }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.put(`/treatments/${treatment_id}`, {
        name,
        category_id,
        default_price,
      });

      // Redux 상태 즉시 반영
      dispatch(updateTreatmentSuccess(response.data));

      return response.data;
    } catch (error) {
      console.error("Treatment update error:", error);
      throw error;
    }
  };

// 📌 시술 삭제
export const deleteTreatment = (treatment_id) => {
  return async (dispatch) => {
    try {
      await apiClient.delete(`/treatments/${treatment_id}`);

      // Redux 상태 즉시 반영
      dispatch(deleteTreatmentSuccess(treatment_id));

      return treatment_id;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};
