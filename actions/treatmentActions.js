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
