import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

import colors from "../styles/color";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { PRIVACY_URL, TERMS_URL } from "../constants/legal";

// 가입 필수 동의 항목 (Formik 필드 이름 기준)
export const CONSENT_ITEMS = [
  { field: "agreeTerms", label: "[필수] 이용약관 동의", url: TERMS_URL },
  {
    field: "agreePrivacy",
    label: "[필수] 개인정보처리방침 동의",
    url: PRIVACY_URL,
  },
  { field: "agreeOver14", label: "[필수] 만 14세 이상입니다" },
];

const openDocument = async (url) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (e) {
    console.error("약관 페이지 열기 실패:", e);
  }
};

const CheckRow = ({ checked, label, onToggle, url, strong }) => (
  <View style={styles.row}>
    <TouchableOpacity
      style={styles.checkTouch}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={{ top: 6, bottom: 6 }}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.label, strong && styles.strongLabel]}>{label}</Text>
    </TouchableOpacity>

    {url && (
      <TouchableOpacity
        onPress={() => openDocument(url)}
        accessibilityRole="link"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.viewLink}>보기</Text>
      </TouchableOpacity>
    )}
  </View>
);

// values: Formik values, setFieldValue/setValues: Formik setter, errorText: 동의 관련 에러(있으면 하나만 표시)
const ConsentChecklist = ({ values, setFieldValue, setValues, errorText }) => {
  const allChecked = CONSENT_ITEMS.every(({ field }) => values[field] === true);

  const toggleAll = () => {
    const next = !allChecked;
    // setFieldValue를 여러 번 부르면 각 호출이 렌더 전 values로 검증해 에러가 남는다
    // → 세 값을 한 번에 바꿔 완성된 값으로 한 번만 검증
    const consents = Object.fromEntries(
      CONSENT_ITEMS.map(({ field }) => [field, next]),
    );
    setValues({ ...values, ...consents });
  };

  return (
    <View style={styles.container}>
      <CheckRow
        checked={allChecked}
        label="전체 동의"
        onToggle={toggleAll}
        strong
      />
      <View style={styles.divider} />
      {CONSENT_ITEMS.map(({ field, label, url }) => (
        <CheckRow
          key={field}
          checked={values[field] === true}
          label={label}
          url={url}
          onToggle={() => setFieldValue(field, !values[field])}
        />
      ))}
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
};

export default ConsentChecklist;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: normalizeSize(8),
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkTouch: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  checkbox: {
    width: normalizeSize(18),
    height: normalizeSize(18),
    borderWidth: 1,
    borderColor: "#2E2B1C",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    borderColor: colors.purple,
    backgroundColor: colors.purple,
  },
  checkMark: {
    color: "#fff",
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(14),
  },
  label: {
    marginLeft: 8,
    fontSize: normalizeFont(13),
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  strongLabel: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
  },
  viewLink: {
    fontSize: normalizeFont(12),
    color: colors.purple,
    fontFamily: "nanumSquareR",
    textDecorationLine: "underline",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDECF4",
  },
  errorText: {
    fontSize: normalizeFont(12),
    color: colors.alert,
    fontFamily: "nanumSquareR",
    letterSpacing: -0.5,
    textAlign: "right",
  },
});
