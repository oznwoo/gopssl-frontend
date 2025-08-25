// components/AutocompleteInput.js
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import debounce from "lodash.debounce";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { commonStyles } from "../../styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { searchCustomer } from "../../actions/customerActions";
import { useDispatch } from "react-redux";
import { normalizeFont } from "../../utils/responsive";

const CustomerSearchInput = ({
  label,
  value,
  placeholder,
  keyExtractor,
  onChangeText,
  minLength = 1,
  errorText,
  mode,
}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(value);
  const [results, setResults] = useState([]);
  const [isActive, setIsActive] = useState(false); // ✅ 검색 활성화 여부
  const [isNew, setIsNew] = useState(false);
  const inputRef = useRef(null);

  // API 호출 디바운스
  const debouncedSearch = useMemo(
    () =>
      debounce(async (text) => {
        if (!isActive) return; // ✅ 비활성화 상태에서는 검색 안 함
        if (text.length < minLength) {
          setResults([]);
          return;
        }
        try {
          const items = await dispatch(searchCustomer(text.trim()));
          setResults(items);
        } catch (e) {
          if (e.response?.status === 404) {
            setResults([]);
          } else {
            console.error("고객 검색 실패", e.message);
          }
        }
      }, 300),
    [dispatch, minLength, isActive]
  );

  // 키워드 포함된 문장 일부만 보여주는 유틸
  const getSnippetWithKeyword = (text, keyword, contextLength = 10) => {
    if (!text || !keyword) return text;
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerText.indexOf(lowerKeyword);
    if (index === -1)
      return text.length > 40 ? text.slice(0, 40) + "..." : text;

    const start = Math.max(index - contextLength, 0);
    const end = Math.min(index + keyword.length + contextLength, text.length);

    const prefix = start > 0 ? "..." : "";
    const suffix = end < text.length ? "..." : "";

    return prefix + text.slice(start, end) + suffix;
  };

  // 키워드 하이라이팅
  const highlightMatchedText = (text, keyword) => {
    if (!keyword) return <Text>{text}</Text>;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <Text
          key={index}
          style={[styles.customerName, { fontFamily: "gamtanDotumB" }]}
        >
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  // 검색어 변경 시 API 호출
  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText, isActive]);

  // 아이템 선택 시
  const handleSelect = (item) => {
    setSearchText(item.name);
    setResults([]);
    setIsActive(false); // ✅ 검색 비활성화
    onChangeText(item.id, item.name);
    inputRef.current?.blur();
  };

  const handleNewCustomer = () => {
    setIsNew(!isNew);
    setIsActive(false); // ✅ 검색 비활성화
    const newCustomerName = !isNew ? "신규고객님" : "";
    setSearchText(newCustomerName);
    onChangeText(-1, newCustomerName);
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <BaseInput
          label={label}
          errorText={errorText}
          useBlur={false}
          readOnly={isNew}
          inputProps={{
            ref: inputRef,
            value: searchText,
            onChangeText: setSearchText,
            onFocus: () => setIsActive(true), // ✅ 포커스 시 검색 활성화
            placeholder,
            style: styles.input,
          }}
          rightIcon={
            searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close" size={20} color={colors.purple} />
              </TouchableOpacity>
            )
          }
          specialButton={
            mode !== "view" && ( // ✅ view 모드에서는 버튼 숨김
              <View
                style={[
                  styles.specialButtonContainer,
                  isNew
                    ? { backgroundColor: colors.purple }
                    : { backgroundColor: "#fff" },
                ]}
              >
                <TouchableOpacity
                  style={styles.specialButton}
                  onPress={handleNewCustomer}
                >
                  <Text
                    style={[
                      styles.specialButtonText,
                      isNew ? { color: "#fff" } : { color: colors.purple },
                    ]}
                  >
                    신규고객
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      </View>
      {isActive &&
        results.length > 0 && ( // ✅ 활성화 상태에서만 목록 표시
          <FlatList
            data={results}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => (
              <>
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => handleSelect(item)}
                >
                  <View style={{ gap: 4 }}>
                    <Text style={styles.customerName}>
                      {highlightMatchedText(`${item.name} 고객님`, searchText)}
                    </Text>
                    <Text style={styles.numOfVisits}>
                      {item.num_of_visits
                        ? `${item.num_of_visits}회 방문`
                        : "미방문"}
                    </Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text
                      style={styles.detail}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {highlightMatchedText(
                        getSnippetWithKeyword(item.detail || "", searchText),
                        searchText
                      )}
                    </Text>
                    <Text style={styles.detail}>
                      {highlightMatchedText(
                        item.phone_number || "",
                        searchText
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < results.length - 1 && (
                  <View style={styles.divideLine} />
                )}
              </>
            )}
            style={styles.list}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
    </View>
  );
};

export default CustomerSearchInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareR",
  },
  list: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxHeight: 200,
    borderTopColor: colors.purple,
    borderTopWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  specialButtonContainer: {
    ...Platform.select({
      android: {
        height: "120%",
      },
      ios: {
        height: "180%",
      },
    }),
    width: "16%",
    position: "absolute",
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderLeftColor: colors.purple,
  },
  specialButton: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  specialButtonText: {
    fontFamily: "nanumSquareEB",
    width: 24,
    textAlign: "center",
    fontSize: normalizeFont(10),
    color: colors.purple,
    numberOfLines: 2,
  },
  customerItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: {
    color: colors.purple,
    fontFamily: "gamtanDotumR",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
  },
  numOfVisits: {
    color: colors.purple,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(8),
    letterSpacing: -0.5,
  },
  infoBox: { gap: 2, maxWidth: "50%" },
  detail: {
    color: colors.lightPurple,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
    letterSpacing: -0.5,
    alignSelf: "flex-end",
  },
  divideLine: { height: 1, backgroundColor: colors.purple, marginVertical: 8 },
});
