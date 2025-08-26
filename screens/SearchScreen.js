import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FloatingExpandedButton from "../components/FloatingExpandedButton";
import { commonStyles } from "../styles/commonStyles";
import colors from "../styles/color";
import { Ionicons, Feather } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { searchCustomer } from "../actions/customerActions";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont } from "../utils/responsive";

const SearchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const [results, setResults] = useState([]);

  const transitionCustomer = (itemId = undefined) => {
    const baseParams = { mode: "view" };
    navigation.navigate("Customer", { ...baseParams, itemId });
  };

  const handleClearText = () => {
    setSearchText("");
    setResults([]);
  };

  const handleBackPress = () => {
    inputRef.current?.blur();
    setIsFocused(false);
    setSearchText("");
    setResults([]);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (name) => {
        if (!name.trim()) {
          setResults([]);
          return;
        }

        try {
          const res = await dispatch(searchCustomer(name.trim()));
          setResults(res);
        } catch (e) {
          if (e.response?.status === 404) {
            setResults([]);
          } else {
            console.error("고객 검색 실패", e.message);
          }
        }
      }, 500),
    [dispatch]
  );

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

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.inputContainer,
            Platform.OS === "android" && { marginTop: 8 },
          ]}
        >
          {isFocused ? (
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={colors.purple} />
            </TouchableOpacity>
          ) : (
            <Feather name="search" size={24} color={colors.purple} />
          )}

          <TextInput
            ref={inputRef}
            placeholder="검색어를 입력해주세요"
            placeholderTextColor={colors.purple} // 색상만 변경 가능
            style={styles.searchInput}
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => {
              setSearchText(text);
              debouncedSearch(text); // ✅ debounce 적용
            }}
          />

          {isFocused && searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClearText}
              style={styles.iconButton}
            >
              <Ionicons name="close" size={24} color={colors.purple} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.horizontalLine}></View>
      </View>

      <View style={styles.resultContainer}>
        {results.length ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) =>
              item.id?.toString() ?? index.toString()
            }
            renderItem={({ item, index }) => (
              <>
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => transitionCustomer(item.id)}
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
          />
        ) : (
          <Text style={styles.emptyText}>검색된 고객이 없습니다.</Text>
        )}
      </View>

      <FloatingExpandedButton style={styles.plusButton} />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerContainer: {
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 6,
    borderWidth: 4,
    borderColor: colors.purple,
    borderRadius: 12,
    ...commonStyles.dropShadow,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontFamily: "NanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    paddingVertical: 4,
  },
  horizontalLine: {
    height: 2,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  emptyText: {
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
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
  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    ...commonStyles.dropShadow,
  },
});
