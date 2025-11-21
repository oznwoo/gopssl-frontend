// src/actions/treatmentActions.js
import { apiClient } from "../constants/baseURL";
import { store } from "../store/store";
import {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
  fetchTreatmentCategoriesSuccess,
  addCategory,
  addTreatment,
  updateTreatmentSuccess,
  deleteTreatmentSuccess,
  updateCategorySuccess,
  updateCategoriesOrderSuccess,
  updateTreatmentsOrderSuccess,
  deleteCategorySuccess,
} from "../store/treatmentSlice";
import { Alert } from "react-native";

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

// 📌 카테고리 내 시술 순서 업데이트
export const updateTreatmentsOrder = (orderedTreatments) => {
  return async (dispatch, getState) => {
    // 롤백을 위해 현재 상태 저장
    const originalTreatments = getState().treatment.treatments;

    // Redux 상태를 먼저 낙관적으로 업데이트
    dispatch(updateTreatmentsOrderSuccess(orderedTreatments));

    try {
      // API에 보낼 데이터 포맷팅: {treatment_id: new_order}
      const payload = orderedTreatments.reduce((acc, treatment, index) => {
        acc[treatment.id] = index;
        return acc;
      }, {});

      // API 경로 수정
      await apiClient.post(`/treatments/reorder`, payload);
    } catch (e) {
      console.error(
        "Error updating treatments order:",
        e.response?.data || e.message
      );
      // 에러 발생 시 원래 순서로 롤백
      dispatch(updateTreatmentsOrderSuccess(originalTreatments));
      Alert.alert("오류", "시술 순서 변경에 실패했습니다. 다시 시도해주세요.");
      throw e;
    }
  };
};

// 📌 카테고리 순서 업데이트
export const updateCategoriesOrder = (orderedCategories) => {
  return async (dispatch, getState) => {
    // 롤백을 위해 현재 상태 저장
    const originalCategories = getState().treatment.categories;

    // Redux 상태를 먼저 낙관적으로 업데이트
    dispatch(updateCategoriesOrderSuccess(orderedCategories));
    try {
      const payload = orderedCategories.reduce((acc, category, index) => {
        acc[category.id] = index;
        return acc;
      }, {});
      await apiClient.post(`/categories/reorder`, payload);
    } catch (e) {
      console.error(
        "Error updating categories order:",
        e.response?.data || e.message
      );
      // 에러 발생 시 원래 순서로 롤백
      dispatch(updateCategoriesOrderSuccess(originalCategories));
      Alert.alert(
        "오류",
        "카테고리 순서 변경에 실패했습니다. 다시 시도해주세요."
      );
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};
// 📌 카테고리 등록
export const createTreatmentCategory =
  ({ name }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.post(`/categories/`, {
        name,
      });

      // Redux 상태 즉시 반영
      dispatch(addCategory(response.data));

      return response.data;
    } catch (error) {
      console.error("Treatment category post error:", error);
      throw error;
    }
  };

// 📌 카테고리 수정
export const updateTreatmentCategory =
  ({ category_id, name }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.put(`/categories/${category_id}`, {
        name,
      });

      // Redux 상태 즉시 반영
      dispatch(updateCategorySuccess(response.data));

      return response.data;
    } catch (error) {
      console.error("Category update error:", error);
      throw error;
    }
  };

// 📌 카테고리 삭제
export const deleteTreatmentCategory = (category_id) => {
  return async (dispatch) => {
    try {
      await apiClient.delete(`/categories/${category_id}`);

      // Redux 상태 즉시 반영
      dispatch(deleteCategorySuccess(category_id));

      return category_id;
    } catch (e) {
      console.log("Error:", e.response?.data || e.message);
      throw e;
    }
  };
};
