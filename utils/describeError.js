// 에러를 로그용 { status, message }로 줄인다.
// axios 에러를 통째로 찍으면 config.headers.Authorization(JWT)과 config.data(비밀번호 등 요청 바디)가
// 같이 찍히고, FastAPI 422 detail의 input에도 보낸 값이 그대로 들어 있다.
// 그래서 상태코드와 서버 에러 메시지(문자열)만 남긴다. 릴리스 빌드에서도 console은 logcat에 남는다.
export const describeError = (e) => {
  const detail = e?.response?.data?.detail;
  let message = e?.message;
  if (typeof detail === "string") message = detail;
  else if (Array.isArray(detail)) message = detail[0]?.msg ?? message;
  return { status: e?.response?.status ?? null, message };
};
