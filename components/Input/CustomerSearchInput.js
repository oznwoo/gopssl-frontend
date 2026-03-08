import React, { useState, useEffect, useRef, forwardRef } from "react";
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
import ModalWrapper from "../ModalWrapper";

const CustomerSearchInput = forwardRef(
  (
    {
      label,
      value,
      placeholder,
      keyExtractor,
      onChangeText,
      minLength = 1,
      errorText,
      editable,
      mode,
      autoFocus,
      onFocus,
      selectedCustomer,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const [searchText, setSearchText] = useState(value); // 검색 텍스트
    const [selectedText, setSelectedText] = useState(value); // 검색된 결과 텍스트
    const [results, setResults] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
      setSelectedText(item.name);
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
      setSelectedText(newCustomerName);
      onChangeText(-1, newCustomerName);
      inputRef.current?.blur();
    };

    useEffect(() => {
      if (isModalVisible) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, [isModalVisible]);

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
              onPressOut={() => {
                setIsModalVisible(true);
              }}
              inputProps={{
                ref: inputRef,
                value: selectedText,
                onBlur: rest.onBlur,
                placeholder,
                style: styles.input,
              }}
              readOnly={true}
              specialButton={
                mode === "register" && (
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
              {...rest}
            />
          </View>

          <ModalWrapper
            isVisible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
            }}
            animationType={"fade"}
            style={styles.modalContainer}
          >
            <BaseInput
              errorText={errorText}
              useBlur={false}
              inputProps={{
                ref: inputRef,
                value: searchText,
                onChangeText: setSearchText,
                onFocus: (e) => {
                  setIsActive(true);
                },
                onBlur: rest.onBlur,
                style: styles.input,
              }}
              rightIcon={
                searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close" size={20} color={colors.purple} />
                  </TouchableOpacity>
                )
              }
            />

            {isActive && results.length > 0 && (
              <View>
                <FlatList
                  data={results}
                  keyExtractor={keyExtractor}
                  renderItem={({ item, index }) => (
                    <>
                      <TouchableOpacity
                        style={styles.customerItem}
                        onPress={() => {
                          handleSelect(item);
                          setIsModalVisible(false);
                        }}
                      >
                        <View style={{ flexDirection: "row", gap: 4 }}>
                          <Text style={styles.customerName}>
                            {highlightMatchedText(
                              `${item.name} 고객님`,
                              searchText
                            )}
                          </Text>
                          <Text style={styles.numOfVisits}>
                            {item.num_of_visits ? `${item.num_of_visits}` : "0"}
                          </Text>
                        </View>
                        <View style={styles.infoBox}>
                          <Text
                            style={styles.detail}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {highlightMatchedText(
                              getSnippetWithKeyword(
                                item.detail || "",
                                searchText
                              ),
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
                  style={styles.list} // 스크롤이 가능하도록 최대 높이 제한
                  scrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </ModalWrapper>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export default React.memo(CustomerSearchInput);

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
  modalContainer: { justifyContent: "flex-start", paddingTop: 60 },
  list: {
    maxHeight: 400,
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
