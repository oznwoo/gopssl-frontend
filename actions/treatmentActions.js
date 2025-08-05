// src/actions/treatmentActions.js
import axios from "axios";
import { BASE_URL } from "../constants/baseURL";
import {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
} from "../store/treatmentSlice";

export const fetchTreatmentsThunk = () => async (dispatch) => {
  dispatch(fetchTreatmentsStart());

  try {
    const response = await axios.get(`${BASE_URL}/treatments/`);
    dispatch(fetchTreatmentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTreatmentsFailure(error.message));
  }
};
