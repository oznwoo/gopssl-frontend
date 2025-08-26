import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import FloatingExpandButton from "../components/FloatingExpandedButton";
import { getSalesByDate } from "../actions/saleActions";
import SaleItem from "../components/SaleItem";
import { formatNumber } from "../utils/format";
import DateHeader from "../components/DateHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { normalizeFont } from "../utils/responsive";

const DailySalesScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [salesData, setSalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const transitionCustomer = useCallback(
    (itemId = undefined) => {
      const baseParams = { mode: "view" };
      navigation.navigate("Customer", { ...baseParams, itemId });
    },
    [navigation]
  );

  const transitionSale = useCallback(
    (itemId = undefined) => {
      const baseParams = {
        saleDate: date.toISOString(),
        mode: "view",
      };

      navigation.navigate("Sale", { ...baseParams, itemId });
    },
    [navigation, date]
  );

  const fetchSalesData = useCallback(async () => {
    const isoDate = date.toISOString().split("T")[0];
    setIsLoading(true);
    try {
      const data = await getSalesByDate(isoDate);
      setSalesData(data.length ? data : null);
    } catch (e) {
      console.log("🔴 API 호출 실패:", e);
      setSalesData(null);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  // 날짜 바뀔 때 데이터 불러오기
  useEffect(() => {
    fetchSalesData();
  }, [date, fetchSalesData]);

  // 화면 다시 포커스될 때마다 데이터 새로 불러오기
  useFocusEffect(
    useCallback(() => {
      fetchSalesData();
    }, [fetchSalesData])
  );

  return (
    <View style={styles.pageContainer}>
      <DateHeader
        currentDate={date}
        onChangeDate={(newDateStr) => setDate(new Date(newDateStr))}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>일일 매출</Text>

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator color={colors.purple} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[
                styles.salesContainer,
                { justifyContent: salesData ? "flex-start" : "center" },
              ]}
            >
              {salesData ? (
                salesData.map((item) => (
                  <SaleItem
                    key={item.id}
                    saleData={item}
                    transitionCustomer={transitionCustomer}
                    transitionSale={transitionSale}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  매출이 등록되지 않았습니다.
                </Text>
              )}
            </ScrollView>
          </View>
        )}

        <FloatingExpandButton style={styles.plusButton} date={date} />
      </View>

      <View
        style={[
          styles.totalContainer,
          Platform.OS === "android" && {
            borderColor: colors.backgroundPurple,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={styles.totalText}>
          총 매출:{" "}
          {salesData
            ? formatNumber(
                salesData.reduce((acc, curr) => acc + curr.total_amount, 0)
              )
            : 0}
          원
        </Text>
      </View>
    </View>
  );
};

export default DailySalesScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    gap: 4,
  },
  horizontalHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  arrowButton: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    ...commonStyles.dropShadow,
  },
  horizontalArrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verticalArrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  dateText: {
    fontFamily: "gamtanDotumB",
    letterSpacing: -0.5,
    fontSize: normalizeFont(20),
    color: colors.purple,
  },
  calendarContainer: { paddingHorizontal: 16 },
  contentContainer: {
    flex: 1,
  },
  contentTitle: {
    marginHorizontal: 36,
    marginVertical: 8,
    fontFamily: "gamtanDotumB",
    color: colors.purple,
    letterSpacing: -0.5,
    fontSize: normalizeFont(24),
  },
  salesContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    gap: 16,
  },
  emptyText: {
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
  },
  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    ...commonStyles.dropShadow,
  },
  totalContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOffset: { width: 0, height: -1 },
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalText: {
    fontFamily: "gamtanBatangB",
    fontSize: normalizeFont(24),
    letterSpacing: -0.5,
    color: colors.purple,
  },
});
