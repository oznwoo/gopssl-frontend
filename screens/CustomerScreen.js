import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../styles/color";
import FormHeader from "../components/FormHeader";
import CustomerForm from "../components/CustomerForm";
import { getCustomerbyId } from "../actions/customerActions";
import { useDispatch } from "react-redux";
import { normalizeFont } from "../utils/responsive";

const CustomerScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mode = route.params?.mode;
  const customerId = route.params?.itemId;
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
    <View style={styles.pageContainer}>
      <FormHeader title={headerTitle} onGoBack={handleGoBack} />

      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator color={colors.purple} />
        ) : mode === "register" ? (
          // 등록 모드일 때는 데이터 없어도 폼 렌더링
          <CustomerForm mode={mode} data={customerData} />
        ) : customerData ? (
          // 등록 모드 아닐 때는 데이터 있을때만 폼 렌더링
          <CustomerForm mode={mode} data={customerData} />
        ) : (
          // 등록 모드가 아니고 데이터도 없으면 메시지 출력
          <View style={styles.emptyText}>
            <Text>고객 데이터를 불러올 수 없습니다.</Text>
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
  },
  contentContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
  },
});
