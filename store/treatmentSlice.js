// src/store/treatmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  treatments: [], // 시술 목록 저장
  loading: false, // 로딩 상태
  error: null, // 에러 메시지
};

const treatmentSlice = createSlice({
  name: "treatment",
  initialState,
  reducers: {
    fetchTreatmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTreatmentsSuccess: (state, action) => {
      state.treatments = action.payload;
      state.loading = false;
    },
    fetchTreatmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;
