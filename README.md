# 💈 Gopssl - 소규모 업장을 위한 무료 고객 · 매출 관리 앱

> 구독료 없이, 부담 없이. 예약제 없이 운영하는 원장님을 위한 고객 및 매출 관리 서비스

<br />

## 📌 프로젝트 소개

**Gopssl**은 예약 제도 없이 운영하는 미용실 원장님을 주요 타겟으로 기획된 **무료 고객·매출 관리 모바일 앱**입니다.

기존 고객·매출 관리 앱 대부분은 구독형 유료 서비스로, 예약 관리가 필요 없는 소규모 업장 원장님들께는 사용하지도 않는 기능에 비용을 지불해야 하는 부담이 있었습니다. Gopssl은 이런 분들을 위해 **꼭 필요한 기능만** 담은 완전 무료 서비스를 목표로 개발했습니다.

미용실 특화 기능 외에도 설계 구조상 **다양한 소규모 업종에서도 활용 가능**하도록 범용적으로 구성되어 있습니다.

<br />

## ✨ 핵심 가치

- 🆓 **완전 무료** — 구독료, 과금 없음
- 📵 **예약 기능 없음** — 필요 없는 기능은 과감히 제외
- 🎯 **간편한 UX** — 비전문가도 쉽게 사용할 수 있는 UI
- 🏪 **범용 설계** — 미용실 외 다른 소규모 업종에서도 사용 가능

<br />

## 📱 주요 기능

**일별 매출 관리**
달력에서 날짜를 선택해 해당 날의 매출 내역을 조회하고, 항목을 등록·수정·삭제할 수 있습니다.

**고객 관리**
고객 정보를 등록하고 관리합니다. 이름, 주소 등 고객 정보를 저장하고 매출과 연결할 수 있습니다.

**검색**
고객명 또는 시술(서비스) 항목으로 매출 데이터를 빠르게 검색할 수 있습니다.

**매출 통계**
월별 매출 막대 차트와 연도별 매출 비교 차트를 제공합니다. 한눈에 매출 흐름을 파악할 수 있습니다.

**회원 인증 및 프로필**
회원가입·로그인을 통해 데이터를 안전하게 보호하고, 프로필을 관리할 수 있습니다.

<br />

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React Native (Expo ~53.0.17) |
| Language | JavaScript (React 19) |
| 상태 관리 | Redux Toolkit + React-Redux |
| 네비게이션 | React Navigation (Stack + Bottom Tabs) |
| HTTP 통신 | Axios |
| 폼 관리 | Formik + Yup |
| 차트 | react-native-gifted-charts |
| 캘린더 | react-native-calendars |
| 로컬 스토리지 | AsyncStorage |
| UI | Expo Vector Icons, Expo Linear Gradient, Expo Blur |

<br />

## 📂 폴더 구조
```
Gopssl-frontend/
├── actions/            # API 호출 함수 (auth, customer, sale, user 등)
├── assets/             # 이미지, 폰트 리소스
├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── Input/               # 커스텀 인풋 컴포넌트
│   ├── SaleForm.js          # 매출 등록 폼
│   ├── CustomerForm.js      # 고객 등록 폼
│   ├── SalesBarChart.js     # 월별 막대 차트
│   ├── YearlyComparisionChart.js  # 연도 비교 차트
│   ├── SignInForm.js        # 로그인 폼
│   ├── SignUpForm.js        # 회원가입 폼
│   └── ...
├── constants/          # 상수 정의
├── navigation/         # 네비게이션 설정
│   ├── AppNavigator.js      # 루트 네비게이터 (Auth / Main 분기)
│   ├── AuthNavigator.js     # 인증 전 화면
│   └── MainNavigator.js     # 인증 후 메인 (Bottom Tab + Stack)
├── schemas/            # Yup 유효성 검사 스키마
├── screens/            # 화면 컴포넌트
│   ├── StartScreen.js            # 로그인 / 회원가입 화면
│   ├── DailySalesScreen.js       # 일별 매출 화면
│   ├── SearchScreen.js           # 검색 화면
│   ├── SalesComparisionScreen.js # 매출 비교 통계 화면
│   ├── SettingScreen.js          # 설정 화면
│   ├── CustomerScreen.js         # 고객 관리 화면
│   ├── SaleScreen.js             # 매출 등록 / 수정 화면
│   ├── ProfileScreen.js          # 프로필 화면
│   ├── DetailScreen.js           # 상세 정보 화면
│   └── AddressSearchScreen.js    # 주소 검색 화면
├── store/              # Redux 전역 상태 관리
│   ├── store.js             # Redux store 설정
│   ├── authSlice.js         # 인증 상태 slice
│   └── treatmentSlice.js    # 시술 항목 상태 slice
├── styles/             # 전역 스타일 및 컬러 정의
├── utils/              # 유틸리티 함수
└── App.js              # 앱 진입점
```

<br />

## 🏗️ 앱 구조
```
App.js
 └── Redux Provider
      └── AppNavigator
           ├── AuthNavigator  ← 비로그인
           │    └── StartScreen (로그인 / 회원가입)
           └── MainNavigator  ← 로그인 후
                ├── Bottom Tab
                │    ├── 일별 매출 (DailySales)
                │    ├── 검색 (Search)
                │    ├── 매출 통계 (Comparision)
                │    └── 설정 (Setting)
                └── Stack
                     ├── 고객 관리 (Customer)
                     ├── 매출 등록 (Sale)
                     ├── 프로필 (Profile)
                     ├── 상세 (Detail)
                     └── 주소 검색 (AddressSearch)
```

<br />

## 🚀 실행 방법
```bash
# 패키지 설치
yarn install

# 개발 서버 실행
yarn start

# Android 실행
yarn android

# iOS 실행
yarn ios
```

> **요구사항:** Node.js, Expo CLI, Android Studio 또는 Xcode
