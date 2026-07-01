import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { apiClient } from "../constants/baseURL";
import {
  restoreCustomer,
  permanentDeleteCustomer,
  getAllCustomer,
} from "../actions/customerActions";
import FormHeader from "../components/FormHeader";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { normalizeFont } from "../utils/responsive";

const DeletedCustomersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
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

  const handleRestore = (customer) => {
    Alert.alert(
      "복구 확인",
      `${customer.detail || customer.name} 고객님을 복구하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "복구",
          style: "default",
          onPress: async () => {
            try {
              await dispatch(restoreCustomer(customer.id));
              await dispatch(getAllCustomer());
              setDeletedList((prev) => prev.filter((c) => c.id !== customer.id));
            } catch (e) {
              Alert.alert("오류", "복구 중 문제가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  const handlePermanentDelete = (customer) => {
    Alert.alert(
      "영구 삭제 확인",
      `정말 영구 삭제하시겠습니까?\n매출 기록은 유지되지만 고객 정보는 완전히 삭제됩니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "영구 삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(permanentDeleteCustomer(customer.id));
              setDeletedList((prev) => prev.filter((c) => c.id !== customer.id));
            } catch (e) {
              Alert.alert("오류", "삭제 중 문제가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

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
          <View style={styles.centered}>
            <ActivityIndicator color={colors.purple} />
          </View>
        ) : sections.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>삭제된 고객이 없습니다.</Text>
          </View>
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
                    <View style={styles.customerInfo}>
                      <Text style={styles.detail}>
                        {c.detail || c.name || "메모 없음"}
                      </Text>
                      <Text style={styles.meta}>
                        등록일 {new Date(c.created_at).toLocaleDateString("ko-KR")}
                        {"  ·  "}
                        삭제일 {new Date(c.deleted_at).toLocaleDateString("ko-KR")}
                      </Text>
                    </View>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.restoreButton}
                        onPress={() => handleRestore(c)}
                      >
                        <Text style={styles.restoreButtonText}>복구</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handlePermanentDelete(c)}
                      >
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
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
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    ...commonStyles.dropShadow,
  },
  customerInfo: {
    gap: 4,
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
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  restoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  restoreButtonText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.alert,
  },
  deleteButtonText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: "#fff",
    letterSpacing: -0.5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(14),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
});
