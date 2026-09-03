// 신규 가입 시 자동으로 채워지는 기본 시술 메뉴.
// 보편적인 미용실 가격표 기준(시술가). 시연용 기본값이며 사용자가 자유롭게 수정/삭제 가능.
export const DEFAULT_TREATMENT_MENU = [
  {
    category: "컷",
    treatments: [
      { name: "여성컷", default_price: 25000 },
      { name: "남성컷", default_price: 20000 },
      { name: "학생컷", default_price: 15000 },
      { name: "앞머리컷", default_price: 5000 },
    ],
  },
  {
    category: "펌",
    treatments: [
      { name: "일반펌", default_price: 88000 },
      { name: "셋팅펌", default_price: 165000 },
      { name: "매직", default_price: 110000 },
      { name: "볼륨매직", default_price: 132000 },
    ],
  },
  {
    category: "염색",
    treatments: [
      { name: "뿌리염색", default_price: 55000 },
      { name: "전체염색", default_price: 77000 },
      { name: "탈색", default_price: 110000 },
      { name: "프리미엄탈색", default_price: 143000 },
    ],
  },
  {
    category: "클리닉",
    treatments: [
      { name: "베이직클리닉", default_price: 55000 },
      { name: "프리미엄클리닉", default_price: 110000 },
      { name: "두피스케일링", default_price: 40000 },
    ],
  },
  {
    category: "드라이",
    treatments: [
      { name: "드라이", default_price: 20000 },
      { name: "업스타일", default_price: 50000 },
    ],
  },
];
