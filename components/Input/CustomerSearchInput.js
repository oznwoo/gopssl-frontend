// components/AutocompleteInput.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from "react-native";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import { Ionicons } from "@expo/vector-icons";
import { normalizeFont } from "../../utils/responsive";
import { commonStyles } from "../../styles/commonStyles";
import { useSelector } from "react-redux";
import {
  getSnippetWithKeyword,
  highlightMatchedText,
} from "../../utils/searchUtils";

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
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState(value);
  const [results, setResults] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Redux에서 고객 리스트 가져오기
  const customers = useSelector((state) => state.customer.list || []);

  // 검색어 변경 시 필터링
  useEffect(() => {
    if (!isActive || searchText.length < minLength) {
      setResults([]);
      return;
    }

    const lower = searchText.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone_number?.includes(lower) ||
        c.detail?.toLowerCase().includes(lower)
    );
    setResults(filtered);
  }, [searchText, isActive, customers, minLength]);

  const handleSelect = (item) => {
    setSearchText(item.name);
    setResults([]);
    setIsActive(false);
    onChangeText(item.id, item.name);
    inputRef.current?.blur();
  };

  const handleNewCustomer = () => {
    setIsNew(!isNew);
    setIsActive(false);
    const newCustomerName = !isNew ? "신규고객님" : "";
    setSearchText(newCustomerName);
    onChangeText(-1, newCustomerName);
    inputRef.current?.blur();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsActive(false);
      }}
      accessible={false}
    >
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
              onFocus: () => setIsActive(true),
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
              mode !== "view" && (
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
        {isActive && results.length > 0 && (
          <View style={styles.listContainer}>
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
                        {highlightMatchedText(
                          `${item.name} 고객님`,
                          searchText
                        )}
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
              scrollEnabled={false} // ScrollView가 스크롤 담당
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomerSearchInput;

// 스타일 유지, listContainer 추가
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
    borderTopColor: colors.purple,
    borderTopWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  specialButtonContainer: {
    ...Platform.select({
      android: { height: "120%" },
      ios: { height: "180%" },
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
