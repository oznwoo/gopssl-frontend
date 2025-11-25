import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isFirst: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUpSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isFirst = true;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
    },
    onboardingSuccess: (state) => {
      state.isFirst = false;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  signUpSuccess,
  signInSuccess,
  logout,
  registerSuccess,
  onboardingSuccess,
} = authSlice.actions;
export default authSlice.reducer;
