// src/actions/addressActions.js
import { apiClient } from "../constants/baseURL";

export const searchAddress = async (query) => {
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
