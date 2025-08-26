import React from "react";
import { Text } from "react-native";
import colors from "../styles/color"; // 프로젝트 경로 맞게 조정 필요
import { normalizeFont } from "./responsive";

// ✅ 검색어가 포함된 텍스트 일부만 추출
export const getSnippetWithKeyword = (text, keyword, contextLength = 10) => {
  if (!text || !keyword) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text.length > 40 ? text.slice(0, 40) + "..." : text;

  const start = Math.max(index - contextLength, 0);
  const end = Math.min(index + keyword.length + contextLength, text.length);

  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  return prefix + text.slice(start, end) + suffix;
};

// ✅ 검색어 하이라이팅
export const highlightMatchedText = (text, keyword) => {
  if (!keyword) return <Text>{text}</Text>;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <Text
        key={index}
        style={{
          color: colors.purple,
          fontFamily: "gamtanDotumB",
          fontSize: normalizeFont(16),
        }}
      >
        {part}
      </Text>
    ) : (
      <Text key={index}>{part}</Text>
    )
  );
};
