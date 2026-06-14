# 디자인 시스템

## 컬러 팔레트

```js
// styles/color.js
colors = {
  purple:           "#743D7B",   // 메인 브랜드 컬러 (탭바, 버튼, 헤더)
  alert:            "#AB3062",   // 경고/삭제 액션
  lightPurple:      "#B99EBD",   // 비활성 탭, placeholder, 보조 텍스트
  secondPurple:     "#B6B6D7",   // 보조 요소
  backgroundPurple: "#F8F5F8",   // 배경색
  green:            "#76B4A0",   // 포인트 (완료, 긍정 상태)
}
```

---

## 폰트

| 키 | 파일 | 용도 |
|----|------|------|
| `logo` | BagelFatOne-Regular | 앱 로고 |
| `gamtanDotumB` | GamtanRoad_Dotum_Bold | 제목, 강조, 탭 레이블 |
| `gamtanDotumR` | GamtanRoad_Dotum_Regular | 본문 |
| `gamtanDotumT` | GamtanRoad_Dotum_Thin | 보조 |
| `gamtanBatangB` | GamtanRoad_Batang_Bold | 금액 표시 (DailySales 하단) |
| `gamtanBatangR` | GamtanRoad_Batang_Regular | 본문 변형 |
| `gamtanBatangT` | GamtanRoad_Batang_Thin | 보조 |
| `nanumSquareB` | NanumSquareB | 검색 input, 일반 텍스트 |
| `nanumSquareR` | NanumSquareR | 소형 텍스트 (방문 횟수 등) |
| `nanumSquareL` | NanumSquareL | 보조 |
| `nanumSquareEB` | NanumSquareEB | 강조 |
| `tjB` / `tjM` / `tjL` / `tjEB` | TJJoyofsinging | 장식용 |

**폰트 로드**: `App.js`에서 `expo-font`로 일괄 로드. 로드 완료 전 스플래시 유지.

---

## 공통 스타일

```js
// styles/commonStyles.js
commonStyles = {
  dropShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,   // Android
  }
}
```

---

## 탭바 스타일

```js
tabBar: { flex: 1, maxHeight: 56 }
tabBarItem: {
  flex: 1,
  borderRadius: 16,
  backgroundColor: colors.purple,  // 활성 탭
}
tabBarActiveTintColor: "#fff"
tabBarInactiveTintColor: colors.lightPurple
tabBarInactiveBackgroundColor: "#fff"
tabBarShowLabel: false   // 라벨 숨김, 아이콘만 표시
```

---

## 컴포넌트 패턴

### 페이지 레이아웃
```jsx
<View style={{ flex: 1, backgroundColor: "#fff" }}>
  <HeaderComponent />
  <ScrollView style={{ flex: 1 }}>
    {/* 콘텐츠 */}
  </ScrollView>
  <FloatingExpandedButton />  {/* FAB */}
</View>
```

### 폼 화면 레이아웃
```jsx
<View style={{ flex: 1 }}>
  <FormHeader title="화면제목" onGoBack={navigation.goBack} />
  <ScrollView>
    <FormComponent />
    <SubmitButton />
  </ScrollView>
</View>
```

### 공통 letterSpacing
모든 한국어 텍스트에 `letterSpacing: -0.5` 적용.

---

## 탭 구조 (아이콘)

| 탭 | 아이콘 | 라이브러리 |
|----|--------|----------|
| DailySales | `calendar` | FontAwesome6 |
| Search | `search` | FontAwesome5 |
| Comparision | `chart-simple` | FontAwesome6 |
| Setting | `settings` | Ionicons |
