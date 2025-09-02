import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Pressable,
  Platform,
  RefreshControl,
  Text,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import CustomerList from "../components/CustomerList";
import FloatingExpandedButton from "../components/FloatingExpandedButton";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import { getAllCustomer } from "../actions/customerActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.list);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const inputRef = useRef(null);

  const handleClearText = () => setSearchText("");

  // 새로고침 핸들러
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getAllCustomer());
    } catch (err) {
      console.log("새로고침 실패:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  return (
    <Pressable style={styles.pageContainer} onPress={Keyboard.dismiss}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.inputContainer,
            Platform.OS === "android" && { marginTop: 8 },
          ]}
        >
          <Feather name="search" size={20} color={colors.purple} />
          <TextInput
            ref={inputRef}
            placeholder="검색어를 입력해주세요"
            placeholderTextColor={`${colors.purple}99`}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClearText}>
              <Ionicons name="close" size={20} color={colors.purple} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.horizontalLine}></View>
      </View>

      {/* 📋 고객 리스트 */}
      <CustomerList
        customers={customers}
        searchText={searchText}
        onItemPress={(id) =>
          navigation.navigate("Customer", { mode: "view", itemId: id })
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.purple} // iOS 인디케이터 색상
            colors={[colors.purple, "blue"]} // Android 인디케이터 색상
            progressBackgroundColor="#fff" // Android 배경색
          />
        }
      />

      {/* ➕ 플로팅 버튼 */}
      <FloatingExpandedButton style={styles.plusButton} />
    </Pressable>
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
    backgroundColor: `${colors.purple}12`,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 12,
    marginTop: 3,
    marginBottom: 8,
    padding: 6,
    borderRadius: 12,
    backgroundColor: `${colors.purple}12`,
  },
  headerTitle: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(20),
    letterSpacing: -0.5,
    color: colors.purple,
  },
  searchInput: {
    flex: 1,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -1,
    paddingVertical: 4,
  },

  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
