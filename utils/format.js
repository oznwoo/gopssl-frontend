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

// 주격 조사 이/가를 붙인다. 마지막 글자가 한글이면 받침으로 고르고,
// 영문·숫자 등으로 끝나면 발음을 알 수 없어 "이(가)"를 쓴다.
export const withSubjectParticle = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${word}이(가)`;
  return `${word}${code % 28 === 0 ? "가" : "이"}`;
};
