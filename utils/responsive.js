import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 기준 화면 크기
const BASE_WIDTH = 430;
const BASE_HEIGHT = 800;

// 폰트 크기 정규화
export function normalizeFont(size) {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);

  let newSize = size * scale;
  newSize = newSize / PixelRatio.getFontScale(); // 폰트 배율 보정

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// 간격, 패딩, 마진 정규화
export function normalizeSize(size) {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);

  let newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
