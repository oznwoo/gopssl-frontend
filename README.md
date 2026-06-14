<h1 align="center">
  <br/>
  Gopssl
  <br/>
</h1>

<p align="center">
  미용실 원장을 위한 모바일 매출 · 고객 관리 앱
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-743D7B?style=flat-square" />
</p>

---

## 소개

Gopssl은 미용실 원장이 하루 매출을 기록하고, 고객 정보를 관리하며, 월별 매출 흐름을 한눈에 파악할 수 있도록 설계된 모바일 앱입니다.

### 주요 기능

| 화면 | 기능 |
|------|------|
| 일별 매출 | 날짜를 선택해 당일 시술 내역 · 매출 합계 조회 |
| 고객 관리 | 고객 등록 · 수정 · 검색 · 방문 이력 |
| 매출 비교 | 월별 막대 차트로 매출 추이 시각화 |
| 설정 | 프로필 · 시술 항목 · 주소 정보 관리 |

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React Native 0.81 · Expo 54 (New Architecture) |
| 언어 | JavaScript |
| 네비게이션 | React Navigation v7 (Stack + BottomTab) |
| 전역 상태 | Redux Toolkit + react-redux |
| HTTP | Axios (JWT 인터셉터 · 자동 토큰 갱신) |
| 폼 검증 | Formik + Yup |
| 차트 | react-native-gifted-charts |
| 로컬 저장소 | AsyncStorage |
| 백엔드 | FastAPI (Render 호스팅) |

---

## 시작하기

### 사전 요구사항

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 15+ / Android: Android Studio

### 설치

```bash
git clone https://github.com/oh7895/Gopssl-frontend.git
cd Gopssl-frontend
npm install
```

### 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 백엔드 URL을 입력합니다.

```env
EXPO_PUBLIC_BASE_URL=https://gopssl-backend.onrender.com
```

### 실행

```bash
# Expo 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android
```

---

## 프로젝트 구조

```
Gopssl-frontend/
├── App.js                    # 엔트리포인트 (폰트 로드, Redux Provider)
├── navigation/               # 네비게이터 (Auth / Main 분기)
├── screens/                  # 화면 단위 컴포넌트
├── components/               # 재사용 컴포넌트 · 입력 필드
├── actions/                  # Redux Thunk API 액션
├── store/                    # Redux 슬라이스 (auth, treatment)
├── schemas/                  # Yup 유효성 검증 스키마
├── constants/                # axios 인스턴스 · 상수
├── styles/                   # 컬러 팔레트 · 공통 스타일
└── utils/                    # 숫자 · 날짜 포맷 유틸
```

---

## 로드맵

- [ ] TypeScript 마이그레이션
- [ ] Expo Router 도입 (파일 기반 라우팅)
- [ ] Redux → Zustand 전환
- [ ] TanStack Query 도입 (서버 상태 캐싱)
- [ ] NativeWind 스타일링 전환
- [ ] Expo EAS Build · 앱스토어 배포

---

## 라이선스

0BSD
