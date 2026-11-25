// utils/format.js
export const formatNumber = (num) => {
  if (typeof num !== "number") return num;
  return Math.abs(num).toLocaleString("ko-KR"); // 1000 -> "1,000"
};

export const formatKoreanDate = (date, options = {}) => {
  if (!date) return "";

  const parsedDate =
    typeof date === "string" ? new Date(date.replace(/\//g, "-")) : date;

  if (isNaN(parsedDate)) return "";

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();

  if (options.monthOnly) {
    return `${year}년 ${month}월`;
  }

  return `${year}년 ${month}월 ${day}일`;
};
