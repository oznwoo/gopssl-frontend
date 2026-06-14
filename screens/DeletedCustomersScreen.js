import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../constants/baseURL";
import FormHeader from "../components/FormHeader";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const DeletedCustomersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [deletedList, setDeletedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeleted = async () => {
      try {
        const res = await apiClient.get("/customers/deleted");
        setDeletedList(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeleted();
  }, []);

  const groupedByMonth = deletedList.reduce((acc, customer) => {
    const date = new Date(customer.deleted_at);
    const key = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(customer);
    return acc;
  }, {});

  const sections = Object.entries(groupedByMonth);

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title="삭제된 고객" onGoBack={() => navigation.goBack()} />
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator color={colors.purple} />
        ) : sections.length === 0 ? (
          <Text style={styles.emptyText}>삭제된 고객이 없습니다.</Text>
        ) : (
          <FlatList
            data={sections}
            keyExtractor={([key]) => key}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: [month, customers] }) => (
              <View style={styles.section}>
                <Text style={styles.monthTitle}>{month}</Text>
                {customers.map((c) => (
                  <View key={c.id} style={styles.customerItem}>
                    <Text style={styles.detail}>{c.detail || "메모 없음"}</Text>
                    <Text style={styles.meta}>
                      등록일 {new Date(c.created_at).toLocaleDateString("ko-KR")}
                      {"  ·  "}
                      삭제일 {new Date(c.deleted_at).toLocaleDateString("ko-KR")}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default DeletedCustomersScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  monthTitle: {
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(16),
    color: colors.purple,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  customerItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  detail: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  meta: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(11),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(14),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
});
