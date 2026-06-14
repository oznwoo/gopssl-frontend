import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../styles/color";
import FormHeader from "../components/FormHeader";
import CustomerForm from "../components/CustomerForm";
import { getCustomerbyId } from "../actions/customerActions";
import { useDispatch } from "react-redux";
import { normalizeFont } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomerScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mode = route.params?.mode;
  const customerId = route.params?.itemId;
  const isDeletedCustomer = !customerId && mode !== "register";
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const headerTitle = customerId ? "고객 정보" : "고객 등록";

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        const data = await dispatch(getCustomerbyId(customerId));
        setCustomerData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title={headerTitle} onGoBack={handleGoBack} />

      <View
        style={[
          styles.contentContainer,
          Platform.OS === "android"
            ? { paddingBottom: insets.bottom }
            : { paddingBottom: 20 },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.purple} />
        ) : mode === "register" ? (
          // 등록 모드일 때는 데이터 없어도 폼 렌더링
          <CustomerForm mode={mode} data={customerData} />
        ) : customerData ? (
          // 등록 모드 아닐 때는 데이터 있을때만 폼 렌더링
          <CustomerForm mode={mode} data={customerData} />
        ) : isDeletedCustomer ? (
          <View style={styles.deletedContainer}>
            <Text style={styles.deletedTitle}>삭제된 고객님</Text>
            <Text style={styles.deletedDescription}>
              6개월 이상 방문 이력이 없어{"\n"}자동 삭제된 고객님입니다.
            </Text>
          </View>
        ) : (
          <View style={styles.emptyText}>
            <Text style={styles.emptyTextContent}>고객 데이터를 불러올 수 없습니다.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPurple,
  },
  emptyText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTextContent: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
  },
  deletedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  deletedTitle: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(18),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
  deletedDescription: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(14),
    color: colors.lightPurple,
    letterSpacing: -0.5,
    textAlign: "center",
    lineHeight: 22,
  },
});
