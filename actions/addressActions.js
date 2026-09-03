// src/actions/addressActions.js
import { apiClient } from "../constants/baseURL";

// 시연용 임시 목 — 백엔드 /address/search(500) 복구 후 false 로 되돌릴 것
const USE_MOCK = true;

const MOCK_RESULTS = [
  {
    road_address: "서울 강남구 테헤란로 129",
    jibun_address: "서울 강남구 역삼동 679-5",
    zone_no: "06133",
  },
  {
    road_address: "서울 강남구 강남대로 396",
    jibun_address: "서울 강남구 역삼동 823",
    zone_no: "06232",
  },
  {
    road_address: "서울 서초구 서초대로 397",
    jibun_address: "서울 서초구 서초동 1327-33",
    zone_no: "06619",
  },
];

export const searchAddress = async (query) => {
  if (USE_MOCK) {
    return MOCK_RESULTS;
  }

  try {
    const res = await apiClient.get(`/address/search`, {
      params: { query },
    });
    return res.data;
  } catch (e) {
    console.warn("주소 검색 실패:", e);
    throw e;
  }
};
