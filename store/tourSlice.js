import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

// 홈 화면 기능 안내(코치마크) 상태.
// - requested: 안내를 띄워 달라는 요청이 있음 (신규 가입 직후 또는 설정 → 다시 보기)
// - replay: 설정에서 다시 보기로 요청함 (이미 본 사용자도 띄움)
// - active: 안내 오버레이가 화면에 떠 있음
// requested || active 동안에는 어제 리포트 모달을 띄우지 않는다.
const initialState = {
  requested: false,
  replay: false,
  active: false,
};

export const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    requestHomeTour: (state, action) => {
      state.requested = true;
      state.replay = action.payload?.replay === true;
    },
    homeTourStarted: (state) => {
      state.requested = false;
      state.active = true;
    },
    // 끝까지 봤거나 건너뛰었거나, 이미 봐서 띄우지 않기로 한 경우 모두
    homeTourFinished: () => initialState,
  },
  // 로그아웃 시 남은 요청을 지운다 (다음에 로그인하는 기존 계정에 안내가 뜨지 않도록)
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { requestHomeTour, homeTourStarted, homeTourFinished } =
  tourSlice.actions;
export default tourSlice.reducer;
