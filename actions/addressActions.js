// src/actions/addressActions.js
import axios from "axios";
import { BASE_URL } from "../constants/baseURL";

export const searchAddress = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/address/search`, {
      params: { query },
    });
    return res.data;
  } catch (e) {
    console.warn("주소 검색 실패:", e);
    throw e;
  }
};
