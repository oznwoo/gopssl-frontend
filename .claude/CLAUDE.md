# Gopssl — 프로젝트 컨텍스트

> AI 어시스턴트를 위한 프로젝트 전체 컨텍스트 파일.
> 코드 작성 전 반드시 이 파일을 먼저 읽을 것.

## 프로젝트 개요

**Gopssl**은 미용실 원장을 위한 모바일 매출/고객 관리 앱이다.
- 플랫폼: iOS + Android (Expo managed workflow)
- 목적: 포트폴리오 + 앱스토어 배포
- 백엔드: FastAPI (`https://gopssl-backend.onrender.com`)

---

## 기술 스택

| 영역 | 현재 사용 | 비고 |
|------|----------|------|
| 프레임워크 | React Native 0.79 + Expo 53 | New Architecture 활성화 |
| 언어 | JavaScript | TypeScript 마이그레이션 예정 |
| 네비게이션 | React Navigation v7 (Stack + BottomTab) | Expo Router 전환 예정 |
| 전역 상태 | Redux Toolkit + react-redux | Zustand 전환 예정 |
| 서버 상태/캐싱 | useState 직접 구현 | TanStack Query 도입 예정 |
| HTTP 클라이언트 | Axios (인터셉터 포함) | |
| 폼 관리 | Formik + Yup | |
| 스타일링 | StyleSheet.create | NativeWind 전환 예정 |
| 차트 | react-native-gifted-charts | |
| 캘린더 | react-native-calendars | |
| 아이콘 | @expo/vector-icons (Ionicons, FontAwesome5/6) | |
| 검색 최적화 | lodash.debounce (500ms) | |
| 로컬 저장소 | AsyncStorage | |
| 배포 | Expo EAS Build 예정 | |

---

## 디렉터리 구조

```
Gopssl-frontend/
├── App.js                    # 엔트리포인트, 폰트 로드, Redux Provider
├── app.json                  # Expo 설정 (newArchEnabled: true)
├── index.js                  # registerRootComponent
│
├── navigation/
│   ├── AppNavigator.js       # isAuthenticated 분기 (Auth / Main)
│   ├── AuthNavigator.js      # 비로그인 플로우 (Start, AddressSearch)
│   └── MainNavigator.js      # BottomTab + Stack 중첩
│
├── screens/
│   ├── StartScreen.js        # 로그인/회원가입 진입
│   ├── DailySalesScreen.js   # 날짜별 매출 (탭 홈)
│   ├── SearchScreen.js       # 고객 검색
│   ├── SalesComparisionScreen.js  # 월별 매출 비교 차트
│   ├── SettingScreen.js      # 설정
│   ├── CustomerScreen.js     # 고객 등록/수정/조회
│   ├── SaleScreen.js         # 매출 등록/수정/조회
│   ├── ProfileScreen.js      # 프로필 수정
│   ├── DetailScreen.js       # 앱 상세정보 (v1.0.0)
│   └── AddressSearchScreen.js # 주소 검색 (카카오 API)
│
├── components/
│   ├── Input/                # BaseInput, DateInput, TreatmentInput 등
│   ├── CustomerForm.js
│   ├── SaleForm.js
│   ├── SaleItem.js
│   ├── SalesBarChart.js
│   ├── YearlyComparisionChart.js
│   ├── DateHeader.js
│   ├── FloatingExpandedButton.js
│   ├── FormHeader.js
│   └── SubmitButton.js
│
├── actions/                  # Redux thunk API 호출
│   ├── authActions.js
│   ├── customerActions.js
│   ├── saleActions.js
│   ├── saleStatisticsActions.js
│   ├── treatmentActions.js
│   ├── userActions.js
│   └── addressActions.js
│
├── store/
│   ├── store.js
│   ├── authSlice.js          # user, token, isAuthenticated
│   └── treatmentSlice.js     # treatments[], loading, error
│
├── schemas/                  # Yup 유효성 스키마
│   ├── signInSchema.js
│   ├── signUpSchema.js
│   ├── CustomerSchema.js
│   ├── SaleSchema.js
│   ├── InfoSchema.js
│   └── UserSchema.js
│
├── constants/
│   ├── baseURL.js            # axios 인스턴스 + JWT 인터셉터
│   └── formTypes.js          # FORM_TYPES enum
│
├── styles/
│   ├── color.js              # 컬러 팔레트
│   └── commonStyles.js       # 공통 스타일 (dropShadow 등)
│
├── utils/
│   └── format.js             # formatNumber, formatKoreanDate
│
└── assets/
    └── fonts/                # BagelFatOne, GamtanRoad, NanumSquare, TJJoyofsinging
```

---

## 참고 파일

- [API 명세](./api.md)
- [데이터 모델](./data-model.md)
- [디자인 시스템](./design-system.md)
- [리빌드 로드맵](./rebuild-roadmap.md)
