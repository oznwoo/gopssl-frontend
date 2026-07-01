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
<img width="1402" height="1122" alt="Gopssl " src="https://github.com/user-attachments/assets/b1e9d7a9-fd07-4cdd-8e8c-33e750102592" />

Gopssl은 미용실 원장이 하루 매출을 즉시 기록하고, 고객 방문 이력을 관리하며, 월별 매출 추이를 확인할 수 있도록 만든 모바일 앱이다.

시중의 미용실 관리 SaaS 대부분은 예약 슬롯 관리를 중심으로 설계되어 있다. 하지만 1인 샵이나 워크인 손님 비중이 높은 소규모 매장에서는 예약 캘린더보다 "오늘 얼마 벌었는지", "이 손님이 몇 번 왔는지"를 빠르게 기록하고 확인하는 것이 더 중요한 문제다. Gopssl은 예약 기능을 걷어내고 매출 기록과 고객 이력 관리에만 집중해서 만들었다.

---

## 핵심 기능

### 홈 — 일별 매출 관리

날짜를 선택하면 해당일 시술 내역과 합계를 바로 확인할 수 있다.
상단 날짜를 누르면 달력이 열리고, 날짜별 매출을 보며 원하는 날로 이동할 수 있다.
<img width="1200" height="1499" alt="홈 화면" src="https://github.com/user-attachments/assets/5f09cf3b-20c7-4c0f-ae54-30eae55d71f5" />

### 고객 관리

자모 순으로 정렬된 고객 목록에서 검색·조회가 가능하다.
플로팅 버튼으로 매출 등록과 고객 등록을 바로 선택할 수 있다.
<img width="1200" height="1499" alt="고객 관리 화면" src="https://github.com/user-attachments/assets/86beef44-934c-41fa-84de-0b2e3e65775c" />


### 매출 통계 · 비교

이번 달 매출과 전월 대비 증감, 결제수단 비율을 한눈에 보여준다.
"감으로 판단하던" 매출 흐름을 데이터로 확인할 수 있게 했다.
<img width="1200" height="1499" alt="매출 관리 화면" src="https://github.com/user-attachments/assets/309291c1-a449-4b25-8ead-a35a062634b9" />


### 설정

시술 관리, 삭제된 고객 관리 등 앱 운영에 필요한 메뉴를 모아뒀다.
<img width="1200" height="1499" alt="설정 화면" src="https://github.com/user-attachments/assets/83eaac69-0af8-41bd-af68-6c3454abb2cf" />


---

## 기술 스택
<img width="2672" height="1781" alt="Group 6" src="https://github.com/user-attachments/assets/215b68ba-7565-4936-a119-70062ad0f358" />

미용실 원장이 모바일 앱에서 요청하면, React Native 앱이 JWT를 포함한
API 요청을 FastAPI 서버로 보낸다. 서버는 PostgreSQL에서 데이터를
조회·저장하고, 주소 검색이 필요할 때만 카카오 로컬 API를 별도로 호출해
keyword API와 address API 결과를 조합한 통합 검색 결과를 반환한다.

- **모바일 앱** (React Native + Expo): Redux Toolkit으로 상태 관리,
Axios 인터셉터로 JWT 자동 첨부·갱신, AsyncStorage로 로컬 캐싱,
Formik + Yup으로 폼 검증
- **서버** (FastAPI, Oracle Cloud): JWT 인증 및 소유권 검증,
고객/매출/시술 CRUD, 매출 통계 집계
- **데이터베이스** (PostgreSQL, SQLAlchemy ORM): 고객·시술·매출 데이터 저장,
트랜잭션 및 무결성 보장
- **외부 연동**: 카카오 로컬 API로 도로명·지번·우편번호 통합 주소 검색

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


