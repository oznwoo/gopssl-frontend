// src/store/treatmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  treatments: [], // 시술 목록 저장
  categories: [],
  loading: false, // 로딩 상태
  error: null, // 에러 메시지
};

const treatmentSlice = createSlice({
  name: "treatment",
  initialState,
  reducers: {
    // 📌 조회 관련
    fetchTreatmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTreatmentsSuccess: (state, action) => {
      state.treatments = action.payload;
      state.loading = false;
    },
    fetchTreatmentCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchTreatmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 📌 추가된 부분 (create / update / delete 성공 시 Redux state 갱신)
    addTreatment: (state, action) => {
      state.treatments.push(action.payload);
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateTreatmentSuccess: (state, action) => {
      state.treatments = state.treatments.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
    },
    deleteTreatmentSuccess: (state, action) => {
      state.treatments = state.treatments.filter(
        (t) => t.id !== action.payload
      );
    },
    updateCategorySuccess: (state, action) => {
      state.categories = state.categories.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
    },
  },
});

export const {
  fetchTreatmentsStart,
  fetchTreatmentsSuccess,
  fetchTreatmentsFailure,
  fetchTreatmentCategoriesSuccess,
  addTreatment,
  addCategory,
  updateTreatmentSuccess,
  deleteTreatmentSuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;
