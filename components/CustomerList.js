import React, { useMemo, useState } from "react";
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
import SectionHeader from "./SectionHeader";

const CustomerList = ({
  customers,
  searchText,
  onItemPress,
  refreshControl,
}) => {
  const [collapsedSections, setCollapsedSections] = useState({ "#": true });

  const getInitial = (name) => {
    if (!name || name === "신규") return "#";
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
    return firstChar.toUpperCase();
  };

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    const result = !searchText.trim()
      ? [...customers]
      : customers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.phone_number?.includes(searchText) ||
            c.detail?.toLowerCase().includes(searchText.toLowerCase()),
        );
    return [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [customers, searchText]);

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
      .map((key) => ({
        title: key,
        data: grouped[key], // 접힘 상태면 data 비움
        count: grouped[key].length, // 👈 고객 수 추가
      }));
  }, [filteredCustomers, searchText]);

  const renderItem = ({ item, index, section }) => {
    if (collapsedSections[section.title]) return null;

    const isLastItem = index === section.data.length - 1;

    return (
      <View>
        <TouchableOpacity
          style={[styles.customerItem, { backgroundColor: "#fff" }]}
          onPress={() => onItemPress(item.id)}
        >
          <View style={styles.customerNameContainer}>
            <Text style={styles.customerName}>{item.name}</Text>

            <Text style={styles.numOfVisits}>
              {item.num_of_visits ? `${item.num_of_visits}` : "0"}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.detail} numberOfLines={1}>
              {item.detail}
            </Text>
            <Text style={styles.detail}>{item.phone_number}</Text>
          </View>
        </TouchableOpacity>

        {/* 구분선을 renderItem 안으로 이동: 마지막 아이템이 아닐 때만 표시 */}
        {!isLastItem && <View style={styles.divideLine} />}
      </View>
    );
  };

  const toggleSection = (title) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!filteredCustomers.length) {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.emptyText}>검색된 고객이 없습니다.</Text>
      </View>
    );
  }

  if (searchText.trim()) {
    // (검색 결과는 기존과 동일)
    return (
      <View style={[styles.contentContainer, { paddingVertical: 4 }]}>
        {filteredCustomers.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.customerItem}
              onPress={() => onItemPress(item.id)}
            >
              <View style={styles.customerNameContainer}>
                <Text
                  style={[styles.customerName, { fontFamily: "nanumSquareR" }]}
                >
                  {highlightMatchedText(`${item.name}`, searchText)}
                </Text>
                <Text style={styles.numOfVisits}>
                  {item.num_of_visits ? `${item.num_of_visits}` : "0"}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.detail} numberOfLines={1}>
                  {highlightMatchedText(
                    getSnippetWithKeyword(item.detail || "", searchText),
                    searchText,
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
    <View style={styles.contentContainer}>
      <View style={styles.numOfCustomers}>
        <Text style={styles.numOfCustomersText}>
          고객 {customers && `(${customers.length})`}
        </Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={true}
        initialNumToRender={30}
        windowSize={100}
        maxToRenderPerBatch={10}
        renderSectionHeader={({ section: { title, count } }) => (
          <SectionHeader
            title={title}
            count={count}
            collapsed={!!collapsedSections[title]}
            onToggle={() => toggleSection(title)}
          />
        )}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 4 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default CustomerList;

const styles = StyleSheet.create({
  pageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  customerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  customerNameContainer: {
    flexDirection: "row",
    gap: 3,
  },
  customerName: {
    color: colors.purple,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -1,
    marginBottom: 2,
  },
  numOfVisits: {
    color: "#fff",
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
    letterSpacing: -0.5,
    alignSelf: "flex-end",
    backgroundColor: colors.opacityPurple,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "nanumSquareB",
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
    backgroundColor: colors.backgroundPurple,
    marginHorizontal: 16,
  },
  numOfCustomers: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${colors.purple}12`,
  },

  numOfCustomersText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    color: colors.purple,
    letterSpacing: -1,
  },
});
