import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import treatmentSlice from "./treatmentSlice";
import customerSlice from "./customerSlice";
import tourSlice from "./tourSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    treatment: treatmentSlice,
    customer: customerSlice,
    tour: tourSlice,
  },
});
