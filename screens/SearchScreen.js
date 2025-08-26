import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomer } from "../actions/customerActions";
import CustomerList from "../components/CustomerList";
import FloatingExpandedButton from "../components/FloatingExpandedButton";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import { commonStyles } from "../styles/commonStyles";

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.list); // Redux에 저장된 전체 고객
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(getAllCustomer());
  }, [dispatch]);

  const handleClearText = () => setSearchText("");

  return (
    <Pressable style={styles.pageContainer} onPress={Keyboard.dismiss}>
      <View style={styles.headerContainer}>
        {/* 🔍 검색 Input */}
        <View
          style={[
            styles.inputContainer,
            Platform.OS === "android" && { marginTop: 8 },
          ]}
        >
          <Feather name="search" size={24} color={colors.purple} />
          <TextInput
            ref={inputRef}
            placeholder="검색어를 입력해주세요"
            placeholderTextColor={colors.purple}
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
  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
