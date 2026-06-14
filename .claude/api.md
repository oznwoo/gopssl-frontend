# API 명세

## Base URL

```
https://gopssl-backend.onrender.com
```

## 인증 방식

- JWT Bearer Token
- `apiClient` (axios 인스턴스) 사용 시 요청 인터셉터가 자동으로 `Authorization: Bearer <token>` 헤더 추가
- 401 응답 시 자동으로 `/auth/refresh` 호출 후 원 요청 재시도
- 갱신 실패 시 자동 로그아웃

## 인증 (Auth)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/auth/signup` | 회원가입 | ❌ |
| POST | `/auth/signin` | 로그인 (form-urlencoded) | ❌ |
| POST | `/auth/refresh` | 토큰 갱신 | ✅ |

### 로그인 요청 형식
```
Content-Type: application/x-www-form-urlencoded
Body: username=<email>&password=<password>
```

### 응답 형식 (로그인/회원가입)
```json
{ "access_token": "eyJ..." }
```

---

## 유저 (Users)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/users/me` | 내 정보 조회 |
| PUT | `/users/:id` | 회원 정보 등록/수정 |

### 유저 수정 요청 Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "store_name": "string",
  "address": "string",
  "zip_code": "string",
  "address_detail": "string"
}
```

---

## 고객 (Customers)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/customers/` | 고객 등록 |
| PUT | `/customers/:id` | 고객 수정 |
| GET | `/customers/:id` | 고객 단건 조회 |
| GET | `/customers/search?name=` | 고객 이름 검색 |
| DELETE | `/customers/:id` | 고객 삭제 |

### 고객 등록/수정 Body
```json
{
  "user_id": "number",
  "name": "string",
  "phone_number": "string",
  "detail": "string"
}
```

### 고객 검색 응답 (배열)
```json
[
  {
    "id": 1,
    "name": "홍길동",
    "phone_number": "010-1234-5678",
    "detail": "메모",
    "num_of_visits": 5
  }
]
```

---

## 매출 (Sales)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/sales/` | 매출 등록 |
| PUT | `/sales/` | 매출 수정 |
| GET | `/sales/:id` | 매출 단건 조회 |
| GET | `/sales/by_date?date=YYYY-MM-DD` | 날짜별 매출 목록 |
| DELETE | `/sales/:id` | 매출 삭제 |

### 매출 등록 Body
```json
{
  "date": "YYYY-MM-DD",
  "customer_id": "number",
  "total_amount": "number",
  "treatments": [{ "treatment_id": 1, "amount": 50000 }]
}
```

---

## 매출 통계 (Statistics)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/sales/statistics/summary/daily?year=&month=` | 일별 매출 요약 |
| GET | `/sales/statistics/summary/monthly?year=&month=` | 월별 매출 요약 |

---

## 시술 (Treatments)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/treatments/` | 전체 시술 목록 조회 |

---

## 에러 응답 형식

```json
{ "detail": "에러 메시지" }           // 400 단일 에러
{ "detail": [{ "msg": "..." }] }     // 422 유효성 에러 (배열)
```

### 에러 처리 패턴
```js
try {
  await apiClient.post(...)
} catch (e) {
  const { status, data } = e.response;
  if (status === 400) message = data.detail;
  if (status === 422) message = data.detail[0]?.msg;
}
```
