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
    // 📌 순서 변경 성공 시 Redux state 갱신
    updateTreatmentsOrderSuccess: (state, action) => {
      // action.payload는 순서가 변경된 일부 시술 목록 또는 롤백을 위한 전체 목록입니다.
      const updatedTreatments = action.payload;
      const updatedIds = new Set(updatedTreatments.map((t) => t.id));

      // 기존 목록에서 변경된 시술들을 제외한 나머지 시술들
      const otherTreatments = state.treatments.filter(
        (t) => !updatedIds.has(t.id)
      );

      // 두 목록을 합쳐서 새로운 전체 시술 목록 생성
      const newTreatments = [...otherTreatments, ...updatedTreatments];

      state.treatments = newTreatments;
    },
    updateCategoriesOrderSuccess: (state, action) => {
      // action.payload는 순서가 변경된 카테고리 목록입니다.
      // display_order를 새로 부여하며 상태를 업데이트합니다.
      state.categories = action.payload.map((category, index) => ({
        ...category,
        display_order: index,
      }));
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
  updateTreatmentsOrderSuccess,
  updateCategoriesOrderSuccess,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;
