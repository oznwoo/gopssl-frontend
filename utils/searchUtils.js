import React from "react";
import { Text } from "react-native";
import colors from "../styles/color"; // 프로젝트 경로 맞게 조정 필요
import { normalizeFont } from "./responsive";

// ✅ 검색어가 포함된 텍스트 일부만 추출
export const getSnippetWithKeyword = (text, keyword, contextLength = 10) => {
  if (!text || !keyword) return text;

  // 줄바꿈과 여러 공백을 단일 공백으로 치환
  const normalizedText = text.replace(/\s+/g, " ");
  const lowerText = normalizedText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1)
    return normalizedText.length > 40
      ? normalizedText.slice(0, 40) + "..."
      : normalizedText;

  const start = Math.max(index - contextLength, 0);
  const end = Math.min(
    index + keyword.length + contextLength,
    normalizedText.length
  );

  const snippet = normalizedText.slice(start, end);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < normalizedText.length ? "..." : "";

  return prefix + snippet + suffix;
};

// ✅ 특수문자 안전 처리
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ✅ 검색어 하이라이팅
export const highlightMatchedText = (text, keyword) => {
  if (!keyword) return <Text>{text}</Text>;

  const escapedKeyword = escapeRegExp(keyword); // 특수문자 escape
  const regex = new RegExp(`(${escapedKeyword})`, "gi");
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <Text
            key={index}
            style={{
              color: colors.purple,
              fontFamily: "nanumSquareEB",
              fontSize: normalizeFont(16),
            }}
          >
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};
