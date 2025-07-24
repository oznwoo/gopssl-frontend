import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUpSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signUpSuccess, signInSuccess, logout, registerSuccess } =
  authSlice.actions;
export default authSlice.reducer;
