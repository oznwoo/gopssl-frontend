<div align="center">
<img width="235" height="79" alt="Gopssl" src="https://github.com/user-attachments/assets/748a9cf9-51c8-48e0-a26e-0c0807f0752e" />
</div>

<p align="center">
  예약 없이 워크인으로 운영되는 소규모 미용실을 위한 매출 · 고객 관리 앱
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-743D7B?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Beta-yellow?style=flat-square" />
</p>

---

## 소개

Gopssl은 미용실 원장이 하루 매출을 즉시 기록하고, 고객 방문 이력을 관리하며, 월별 매출 추이를 확인할 수 있도록 만든 모바일 앱이다.

시중의 미용실 관리 SaaS 대부분은 예약 슬롯 관리를 중심으로 설계되어 있다. 하지만 1인 샵이나 워크인 손님 비중이 높은 소규모 매장에서는 예약 캘린더보다 "오늘 얼마 벌었는지", "이 손님이 몇 번 왔는지"를 빠르게 기록하고 확인하는 것이 더 중요한 문제다. Gopssl은 예약 기능을 걷어내고 매출 기록과 고객 이력 관리에만 집중해서 만들었다.

---

## 핵심 기능

| 기능 | 왜 필요했는가 |
|---|---|
| 일별 매출 관리 | 원장이 시술 직후 매출을 바로 기록해야 정산을 위해 별도 장부를 만들 필요가 없어진다. 날짜를 선택하면 해당일 시술 내역과 합계를 바로 확인할 수 있다. |
| 고객 관리 (소프트 삭제 · 복구) | 고객을 즉시 영구 삭제하면 매출 기록과의 연결이 끊겨 통계가 깨진다. 삭제는 목록에서 숨기는 것으로 처리하고, 복구와 영구 삭제를 별도 플로우로 분리했다. |
| 월별 매출 비교 | "이번 달이 저번 달보다 나은지"를 감으로만 판단하고 있었다. 막대 차트로 월별 추이를 시각화해 판단 근거를 제공한다. |
| 시술 항목 드래그 정렬 | 매장마다 자주 쓰는 시술·카테고리 순서가 다른데 고정 순서면 매번 스크롤해서 찾아야 한다. 드래그로 순서를 직접 커스터마이징할 수 있게 했다. |
| 온보딩 | 매장 정보(store_name) 없이 가입만 마친 상태로 메인 화면에 들어가면 빈 데이터 화면만 보게 된다. 최초 실행 시 필수 정보 입력을 유도하는 온보딩을 별도 플로우로 분리했다. |
| 데일리 리포트 모달 | 앱을 하루 한 번 열까 말까 하는 사용 패턴을 고려해, 부팅 시 어제 매출 요약(방문 수, 현금/카드 비율)을 자동으로 띄워 확인 동선을 줄였다. |

---

## 기술 스택

| 영역 | 기술 | 비고 |
|---|---|---|
| 프레임워크 | React Native 0.81 + Expo 54 | New Architecture 활성화 |
| 네비게이션 | React Navigation v7 (Native Stack + Bottom Tabs) | Auth / Onboarding / Main 3분기 구조 |
| 상태 관리 | Redux Toolkit + react-redux | auth / customer / treatment 슬라이스 분리 |
| HTTP | Axios | 요청/응답 인터셉터로 JWT 자동 첨부 및 자동 갱신 |
| 폼 검증 | Formik + Yup | 화면별 스키마 분리 |
| 로컬 저장 | AsyncStorage | 세션 토큰, 고객 목록 캐시, 온보딩/리포트 표시 여부 저장 |
| 차트 | react-native-gifted-charts | 일별/월별 매출 시각화 |
| 드래그 정렬 | react-native-draggable-flatlist, react-native-draggable-grid | 시술 항목·카테고리 순서 커스터마이징 |
| 백엔드 | FastAPI | Oracle Cloud 인스턴스에서 systemd로 상시 구동 |

---

## 엔지니어링 하이라이트

### JWT 자동 갱신 인터셉터

**문제**: 세션이 만료되면 API 요청이 401로 실패한다. 화면마다 이를 감지해서 재로그인시키는 로직을 반복 작성하면 화면 수만큼 중복 코드가 생기고, 사용자는 작업 도중 갑자기 로그아웃당하게 된다.

**해결**: axios 인스턴스에 요청/응답 인터셉터를 걸었다. 요청 시 Redux에 저장된 토큰을 자동으로 헤더에 붙이고, 401 응답을 받으면 `/auth/refresh`로 토큰을 갱신한 뒤 실패했던 원래 요청을 한 번 재시도한다. 갱신마저 실패하면 그때 로그아웃 액션을 디스패치한다. 화면 레벨 코드는 인증 로직을 전혀 신경 쓰지 않아도 된다.

파일: [constants/baseURL.js](constants/baseURL.js)

### 오프라인 우선 고객 캐시 (stale-while-revalidate)

**문제**: 고객 목록 API 응답을 기다리는 동안 빈 화면이 노출되고, 네트워크가 불안정한 환경에서는 목록 자체가 뜨지 않는 경우가 있었다.

**해결**: 앱 부팅 시 AsyncStorage에 저장된 고객 목록 캐시를 먼저 Redux에 반영해 즉시 렌더링하고, 그 다음 백그라운드에서 서버 최신 데이터를 받아와 캐시와 상태를 함께 갱신한다. 화면은 항상 오래된 데이터라도 먼저 보여주고, 최신화는 비동기로 따라오게 했다.

파일: [actions/customerActions.js](actions/customerActions.js) (`loadCustomersFromStorage`, `getAllCustomer`), [navigation/AppNavigator.js](navigation/AppNavigator.js)

### 부트스트랩 분기 로직 (Auth / Onboarding / Main)

**문제**: 로그인 여부만으로 화면을 나누면 "가입은 했지만 매장 정보를 아직 입력하지 않은 유저"와 "정상 이용 중인 기존 유저"를 구분할 수 없다. 매번 온보딩을 다시 보여주거나, 반대로 필수 정보 입력 단계를 건너뛰는 문제가 실제로 발생했다.

**해결**: 앱 부팅 시 토큰 존재 여부, 온보딩 시청 플래그(`@viewedOnboarding`), 유저의 `store_name` 존재 여부를 조합해 Auth / Onboarding / Main 세 갈래로 라우팅을 분기했다. 기존 유저가 앱을 재설치했을 때 온보딩 화면으로 잘못 진입하는 버그를 실제로 겪고 수정한 이력이 커밋 로그에 남아 있다.

파일: [navigation/AppNavigator.js](navigation/AppNavigator.js)

### 소프트 삭제 도메인 모델링

**문제**: 고객을 즉시 삭제(hard delete)하면 해당 고객과 연결된 매출 기록의 참조가 끊겨 월별 통계가 어긋나고, 실수로 삭제했을 때 되돌릴 방법이 없었다.

**해결**: 고객 삭제를 `is_customer_deleted` 플래그 기반의 소프트 삭제로 바꿨다. 목록에서는 숨기되 매출 데이터와의 연결은 유지하고, 별도 "삭제된 고객" 화면에서 복구 또는 영구 삭제를 선택하게 분리했다. 영구 삭제를 실행해도 매출 기록 자체는 보존해 통계가 깨지지 않게 했고, 삭제된 고객이 연결된 매출 화면은 읽기 전용(입력 오버레이, 수정 버튼 숨김)으로 전환해 오조작을 막았다.

파일: [actions/customerActions.js](actions/customerActions.js), [screens/DeletedCustomersScreen.js](screens/DeletedCustomersScreen.js), [components/SaleForm.js](components/SaleForm.js), [components/CustomerForm.js](components/CustomerForm.js)

---

## 폴더 구조

```
Gopssl-frontend/
├── App.js                    # 엔트리포인트 (폰트 로드, Redux Provider)
├── navigation/
│   ├── AppNavigator.js       # 부트스트랩 및 Auth/Onboarding/Main 분기
│   ├── AuthNavigator.js      # 로그인/회원가입 플로우
│   ├── OnboardingNavigator.js
│   └── MainNavigator.js      # BottomTab + Stack 중첩
├── screens/                  # 13개 화면 단위 컴포넌트
├── components/                # 폼, 리스트, 차트, 모달 등 재사용 컴포넌트
│   └── Input/                 # 입력 필드 컴포넌트 모음
├── actions/                   # Redux Thunk 기반 API 호출
├── store/                     # authSlice, customerSlice, treatmentSlice
├── schemas/                   # Yup 유효성 검증 스키마
├── constants/                  # axios 인스턴스(JWT 인터셉터) · 상수
├── styles/                     # 컬러 팔레트 · 공통 스타일
└── utils/                      # 숫자/날짜 포맷, 검색, 반응형 유틸
```

---

## 시작하기

```bash
git clone https://github.com/oh7895/Gopssl-frontend.git
cd Gopssl-frontend
npm install
cp .env.example .env   # EXPO_PUBLIC_BASE_URL 설정 후

npm start        # Expo 개발 서버
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
```

---

## 현재 상태 및 로드맵

**백엔드**: FastAPI를 Oracle Cloud 인스턴스에서 systemd 서비스로 상시 구동 중.

**프론트엔드**: 개인 기기 배포로 베타 테스트 진행 중이며, 스토어(App Store / Google Play) 출시를 준비하고 있다. EAS Build 설정은 되어 있으나 아직 정식 제출 전 단계다.

혼자 개발하고 있고 계속 개선 중인 프로젝트라, 알려진 문제와 부족한 부분을 그대로 남겨둔다.

- 백엔드 통신이 아직 HTTPS로 전환되지 않았다. 스토어 출시 전 TLS 적용이 필요하다.
- 일부 액션 파일(`authActions.js` 등)에 디버깅용 `console.log`가 남아 있어 정리가 필요하다.
- 자동화된 테스트가 없다. 회귀를 사람이 직접 확인하고 있어 우선순위로 도입할 계획이다.
- 매출/시술 데이터가 아직 인메모리 위주로 관리돼, 고객 캐시처럼 TanStack Query 기반 캐싱으로 확장할 예정이다.
- `DetailScreen`(앱 정보 화면)이 최소 구현 상태다.
- 장기적으로 TypeScript 전환, Expo Router 도입, Redux → Zustand/TanStack Query 전환을 계획하고 있다.

---

## 커밋 히스토리

총 162개 커밋. 기능 단위로 브랜치를 나누고(`feature/onboarding`, `feature/customer-cleanup-on-boot` 등) PR로 병합하는 흐름으로 개발했다.

---

## 라이선스

0BSD
