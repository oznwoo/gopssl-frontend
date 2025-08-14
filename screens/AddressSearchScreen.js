import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import debounce from "lodash.debounce";
import { searchAddress } from "../actions/addressActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { useRoute } from "@react-navigation/native";

const AddressSearchScreen = ({ navigation }) => {
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const debouncedSearch = debounce(async (text) => {
    try {
      const res = await searchAddress(text);
      setResults(res);
    } catch (e) {
      // 에러 핸들링
      console.error("주소 검색 실패", e);
    }
  }, 300);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (item) => {
    const selected = {
      addressName: item.road_address ? item.road_address : item.jibun_address,
      zipCode: item.zone_no,
    };
    navigation.navigate(route?.params?.backScreen, {
      selectedAddress: selected,
      formType: "info",
      formData: route?.params?.formData,
    });
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.purple} />
        </TouchableOpacity>
        <TextInput
          placeholder="주소를 입력하세요"
          onChangeText={setQuery}
          value={query}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.separatorLine} />

      <View style={styles.resultContainer}>
        <FlatList
          data={results}
          keyExtractor={(item, index) =>
            (item.address_name ||
              item.road_address?.address_name ||
              item.jibun_address ||
              "unknown") + index
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.addressItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.addressName}>
                {item.road_address ? item.road_address : item.jibun_address}
              </Text>
              <Text style={styles.zipCode}>{item.zone_no}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default AddressSearchScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 8,
    borderWidth: 4,
    borderColor: colors.purple,
    borderRadius: 12,
  },
  backButton: {},
  searchInput: {
    flex: 1,
    fontFamily: "NanumSquareB",
    fontSize: 16,
    letterSpacing: -0.5,
  },
  separatorLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  resultContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addressItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    paddingBottom: 10,
    marginTop: 4,
  },
  addressName: {
    fontFamily: "gamtanDotumB",
    fontSize: 16,
    letterSpacing: -0.5,
    lineHeight: 26,
    color: colors.purple,
  },
  zipCode: {
    fontFamily: "nanumSquareR",
    fontSize: 8,
    color: colors.purple,
  },
});
