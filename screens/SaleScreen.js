import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FormHeader from "../components/FormHeader";
import SaleForm from "../components/SaleForm";
import colors from "../styles/color";
import { useDispatch } from "react-redux";
import { getSaleById } from "../actions/saleActions";
import { normalizeFont } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SaleScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const saleId = route.params?.itemId;
  const [saleData, setSaleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const headerTitle = saleId ? "매출 정보" : "매출 등록";
  const mode = route.params?.mode;

  useEffect(() => {
    if (!saleId) return;

    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        const data = await dispatch(getSaleById(saleId));
        setSaleData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [saleId]);

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
          <SaleForm mode={mode} data={saleData} saleDate={saleData} />
        ) : saleData ? (
          // 등록 모드 아닐 때는 데이터 있을때만 폼 렌더링
          <SaleForm mode={mode} data={saleData} saleDate={saleData} />
        ) : (
          // 등록 모드가 아니고 데이터도 없으면 메시지 출력
          <View style={styles.emptyText}>
            <Text>매출 데이터를 불러올 수 없습니다.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SaleScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
  },
});
