// utils/format.js
export const formatNumber = (num) => {
  if (typeof num !== "number") return num;
  return num.toLocaleString("ko-KR"); // 1000 -> "1,000"
};
