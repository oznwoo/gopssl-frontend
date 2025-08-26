import React, { useMemo } from "react";
import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import {
  highlightMatchedText,
  getSnippetWithKeyword,
} from "../utils/searchUtils";

const CustomerList = ({ customers, searchText, onItemPress }) => {
  // 초성 추출 함수
  const getInitial = (name) => {
    if (!name) return "#";
    const firstChar = name[0];
    const code = firstChar.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const cho = Math.floor((code - 0xac00) / 588);
      const initials = [
        "ㄱ",
        "ㄲ",
        "ㄴ",
        "ㄷ",
        "ㄸ",
        "ㄹ",
        "ㅁ",
        "ㅂ",
        "ㅃ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅉ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ",
      ];
      return initials[cho];
    }

    return firstChar.toUpperCase(); // 영문/기타
  };

  // 🔍 검색어 필터링 + 가나다 순 정렬
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    const result = !searchText.trim()
      ? [...customers] // 원본 배열 보호
      : customers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.phone_number?.includes(searchText) ||
            c.detail?.toLowerCase().includes(searchText.toLowerCase())
        );
    return [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [customers, searchText]);

  // 검색어 없을 때 초성별 섹션 생성
  const sections = useMemo(() => {
    if (searchText.trim() || !filteredCustomers.length) return [];
    const grouped = {};
    filteredCustomers.forEach((customer) => {
      const initial = getInitial(customer.name);
      if (!grouped[initial]) grouped[initial] = [];
      grouped[initial].push(customer);
    });
    return Object.keys(grouped)
      .sort()
      .map((key) => ({ title: key, data: grouped[key] }));
  }, [filteredCustomers, searchText]);

  if (!filteredCustomers.length) {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.emptyText}>검색된 고객이 없습니다.</Text>
      </View>
    );
  }

  // 검색어가 있으면 그냥 FlatList, 없으면 SectionList
  if (searchText.trim()) {
    return (
      <View style={styles.contentContainer}>
        {filteredCustomers.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.customerItem}
              onPress={() => onItemPress(item.id)}
            >
              <View>
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
                <Text style={styles.detail} numberOfLines={1}>
                  {highlightMatchedText(
                    getSnippetWithKeyword(item.detail || "", searchText),
                    searchText
                  )}
                </Text>
                <Text style={styles.detail}>
                  {highlightMatchedText(item.phone_number || "", searchText)}
                </Text>
              </View>
            </TouchableOpacity>
            {index !== filteredCustomers.length - 1 && (
              <View style={styles.divideLine} />
            )}
          </View>
        ))}
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      stickySectionHeadersEnabled={true}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
      )}
      renderItem={({ item, index, section }) => (
        <TouchableOpacity
          style={[
            styles.customerItem,
            { backgroundColor: colors.backgroundPurple },
            index === 0 && {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
            index === section.data.length - 1 && {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            },
          ]}
          onPress={() => onItemPress(item.id)}
        >
          <View>
            <Text style={styles.customerName}>
              <Text style={{ fontFamily: "gamtanDotumB" }}>{item.name}</Text>
              고객님
            </Text>
            <Text style={styles.numOfVisits}>
              {item.num_of_visits ? `${item.num_of_visits}회 방문` : "미방문"}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.detail} numberOfLines={1}>
              {item.detail}
            </Text>
            <Text style={styles.detail}>{item.phone_number}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 4 }}
      ItemSeparatorComponent={() => <View style={styles.divideLine} />}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default CustomerList;

const styles = StyleSheet.create({
  pageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: {
    flex: 1,
    paddingVertical: 4,
    justifyContent: "flex-start",
  },
  sectionHeaderContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundPurple,
    borderRadius: 4,
  },
  sectionHeaderText: {
    fontSize: normalizeFont(14),
    fontFamily: "nanumSquareEB",
    color: colors.purple,
    marginTop: 12,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  customerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  customerName: {
    color: colors.purple,
    fontFamily: "gamtanDotumR",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    marginBottom: 2,
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
  infoBox: { gap: 2 },
  detail: {
    color: colors.lightPurple,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
    letterSpacing: -0.5,
    alignSelf: "flex-end",
  },
  divideLine: {
    height: 1,
    backgroundColor: colors.purple,
    marginHorizontal: 16,
  },
});
