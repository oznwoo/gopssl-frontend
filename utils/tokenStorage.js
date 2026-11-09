import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// JWT 토큰은 SecureStore(iOS Keychain / Android Keystore)에 저장한다.
// "user", "@viewedOnboarding", 고객 캐시는 비밀값이 아니므로 AsyncStorage 유지.
const TOKEN_KEY = "token";
// 구버전 앱이 AsyncStorage에 평문으로 저장하던 키 (1회 마이그레이션 대상)
const LEGACY_TOKEN_KEY = "token";

const readLegacyToken = async () => {
  try {
    return await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

const removeLegacyToken = async () => {
  try {
    await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch (e) {
    // 다음 getToken에서 다시 정리된다
  }
};

export const getToken = async () => {
  let secureToken = null;
  try {
    secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    // 읽기 실패 시 구버전 값이라도 반환해 로그아웃을 막는다 (삭제는 하지 않음)
    console.log("SecureStore 읽기 실패:", e?.message);
    return await readLegacyToken();
  }
  if (secureToken) return secureToken;

  // 1회 마이그레이션: AsyncStorage → SecureStore
  const legacyToken = await readLegacyToken();
  if (!legacyToken) return null;

  try {
    await SecureStore.setItemAsync(TOKEN_KEY, legacyToken);
  } catch (e) {
    // 저장 실패 시 AsyncStorage 값을 지우지 않는다 (기존 사용자 로그아웃 방지 최우선)
    console.log("토큰 마이그레이션 실패:", e?.message);
    return legacyToken;
  }

  // SecureStore 저장이 성공한 뒤에만 평문 사본 삭제
  await removeLegacyToken();
  return legacyToken;
};

export const setToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  // 새 토큰이 안전하게 저장됐으니 남아 있을 수 있는 평문 사본 정리
  await removeLegacyToken();
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  // 평문 사본이 남아 있으면 다음 getToken에서 마이그레이션되어 다시 로그인되므로 함께 삭제
  await removeLegacyToken();
};
