import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  isLoading: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    setIsLoadingCustomers: (state) => {
      state.isLoading = true;
    },
  },
});

export const { setCustomers, setIsLoadingCustomers } = customerSlice.actions;
export default customerSlice.reducer;
