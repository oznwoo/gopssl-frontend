# 리빌드 로드맵

## 목표
- 포트폴리오 완성도 향상
- iOS + Android 앱스토어 배포
- 현대적인 React Native 스택으로 업그레이드

---

## 스택 전환 계획

| 영역 | AS-IS | TO-BE |
|------|-------|-------|
| 언어 | JavaScript | **TypeScript** |
| 네비게이션 | React Navigation 수동 구성 | **Expo Router** (파일 기반) |
| 전역 상태 | Redux Toolkit | **Zustand** |
| 서버 상태 | useState + 수동 캐싱 | **TanStack Query** |
| 스타일링 | StyleSheet.create | **NativeWind** (Tailwind RN) |
| 배포 | 없음 | **Expo EAS Build** |

---

## Phase 1 — 기반 세팅
- [ ] TypeScript 마이그레이션 (`.js` → `.tsx`)
- [ ] Expo Router 도입 및 네비게이션 구조 재설계
- [ ] NativeWind 세팅

**목표 디렉터리 구조 (Expo Router)**
```
app/
  (auth)/
    index.tsx           ← StartScreen (로그인/회원가입)
    address-search.tsx
  (main)/
    (tabs)/
      index.tsx         ← DailySalesScreen
      search.tsx
      comparison.tsx
      setting.tsx
    customer/
      index.tsx         ← 고객 등록
      [id].tsx          ← 고객 조회/수정
    sale/
      index.tsx
      [id].tsx
    profile.tsx
    detail.tsx
    address-search.tsx
```

---

## Phase 2 — 상태관리 현대화
- [ ] Redux → Zustand 전환
- [ ] TanStack Query 도입 (날짜별 매출 캐싱, 고객 검색 등)

**Zustand 스토어 구조**
```ts
// store/authStore.ts
useAuthStore: {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signIn: (token, user) => void
  logout: () => void
}

// store/treatmentStore.ts
useTreatmentStore: {
  treatments: Treatment[]
  setTreatments: (list) => void
}
```

---

## Phase 3 — 기능 개선
- [ ] DailySalesScreen: TanStack Query로 캐싱 교체
- [ ] SearchScreen: TanStack Query useQuery로 debounce 검색 교체
- [ ] DetailScreen: 실제 앱 정보 화면으로 구현 (현재 미구현)
- [ ] 앱 전체 에러 바운더리 추가
- [ ] 로딩 스켈레톤 UI 추가

---

## Phase 4 — 배포
- [ ] `app.json` bundle identifier / package name 설정
- [ ] EAS Build 설정 (`eas.json`)
- [ ] iOS TestFlight 배포
- [ ] Google Play 내부 테스트 배포
- [ ] 앱스토어 심사 제출

---

## 알려진 버그 / 기술 부채

- `App.js`: `setAppIsLoaded`가 선언 없이 `finally`에서 호출됨 → 폰트 로딩 후 스플래시가 안 닫힘
- `authActions.js`: `console.log` 디버깅 코드 다수 잔존 → 제거 필요
- 매출 캐시(`salesCache`)가 인메모리라 앱 재시작 시 초기화됨 → TanStack Query로 해결 가능
- 시술 항목(`treatments`)이 Redux에 저장되지만 앱 재시작 시 재fetch 필요
- `DetailScreen`이 사실상 미구현 상태 (버전 텍스트만 있음)
