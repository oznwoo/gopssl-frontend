# 데이터 모델

## Redux Store 구조

```ts
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean
  },
  treatment: {
    treatments: Treatment[],
    loading: boolean,
    error: string | null
  }
}
```

---

## 주요 타입 정의

### User
```ts
type User = {
  id: number;
  name: string;
  email: string;
  store_name: string;
  address: string;
  zip_code: string;
  address_detail: string;
};
```

### Customer
```ts
type Customer = {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  detail: string;
  num_of_visits: number;
};
```

### Sale
```ts
type Sale = {
  id: number;
  date: string;           // "YYYY-MM-DD"
  customer_id: number;
  total_amount: number;
  treatments: SaleTreatment[];
};

type SaleTreatment = {
  treatment_id: number;
  amount: number;
};
```

### Treatment
```ts
type Treatment = {
  id: number;
  name: string;
};
```

### DailySalesSummary
```ts
type DailySalesSummary = {
  date: string;
  total: number;
};
```

### MonthlySalesSummary
```ts
type MonthlySalesSummary = {
  month: number;
  total: number;
};
```

---

## AsyncStorage 키 목록

| Key | Value | 설명 |
|-----|-------|------|
| `"token"` | JWT 문자열 | 액세스 토큰 |
| `"user"` | JSON.stringify(User) | 유저 정보 |

---

## 폼 타입 (FORM_TYPES)

```js
FORM_TYPES = {
  START: "start",      // 시작 화면
  SIGN_IN: "signin",   // 로그인
  SIGN_UP: "signup",   // 회원가입
  INFO: "info",        // 추가 정보 입력
}
```

---

## 네비게이션 파라미터

### CustomerScreen
```ts
{
  mode: "view" | "create" | "edit";
  itemId?: number;   // 조회/수정 시 고객 ID
}
```

### SaleScreen
```ts
{
  mode: "view" | "create" | "edit";
  itemId?: number;     // 조회/수정 시 매출 ID
  saleDate?: string;   // 등록 시 기본 날짜 (ISO string)
}
```
