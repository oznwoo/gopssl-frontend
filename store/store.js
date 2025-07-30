import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import treatmentSlice from "./treatmentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    treatment: treatmentSlice,
  },
});
