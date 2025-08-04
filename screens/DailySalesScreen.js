import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import FloatingExpandButton from "../components/FloatingExpandedButton";
import { getSalesByDate } from "../actions/saleActions";
import SaleItem from "../components/SaleItem";
import { formatNumber } from "../utils/format";
import DateHeader from "../components/DateHeader";
import { useNavigation } from "@react-navigation/native";
import { isAllOf } from "@reduxjs/toolkit";

const salesByDate = {
  "2025-08-01": 123000,
  "2025-08-02": 98000,
  "2025-08-03": 76000,
  "2025-08-04": 145000,
  "2025-08-05": 0,
  "2025-08-06": 220000,
  "2025-08-07": 198000,
};

const DailySalesScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [salesCache, setSalesCache] = useState({});
  const [salesData, setSalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const transitionCustomer = (mode, itemId = undefined) => {
    const baseParams = { mode };
    if (mode === "register") {
      navigation.navigate("Customer", baseParams);
    } else if (mode === "view") {
      navigation.navigate("Customer", { ...baseParams, itemId });
    }
  };

  const transitionSale = (mode, itemId = undefined) => {
    const baseParams = { saleDate: date.toISOString(), mode };
    if (mode === "register") {
      navigation.navigate("Sale", baseParams);
    } else if (mode === "view") {
      navigation.navigate("Sale", { ...baseParams, itemId });
    }
  };

  const hideExpanded = () => {
    if (isExpanded) setIsExpanded(false);
  };

  useEffect(() => {
    const isoDate = date.toISOString().split("T")[0];
    const isCached = Object.prototype.hasOwnProperty.call(salesCache, isoDate);

    if (isCached) {
      setSalesData(salesCache[isoDate]);
      setIsLoading(false);
      return;
    }

    const fetchSalesData = async () => {
      setIsLoading(true);

      try {
        const data = await getSalesByDate(isoDate);
        setSalesData(data.length ? data : null);
        setSalesCache((prev) => ({
          ...prev,
          [isoDate]: data.length ? data : null,
        }));
      } catch (e) {
        console.log("🔴 API 호출 실패:", e);
        setSalesData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [date]);

  return (
    <TouchableWithoutFeedback onPress={hideExpanded}>
      <View style={styles.pageContainer}>
        <DateHeader
          currentDate={date}
          onChangeDate={(newDateStr) => setDate(new Date(newDateStr))}
          salesByDate={salesByDate}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>일일 매출</Text>

          <View style={{ flex: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
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

          <FloatingExpandButton
            style={styles.plusButton}
            date={date}
            transitionCustomer={transitionCustomer}
            transitionSale={transitionSale}
          />
        </View>

        <View style={styles.totalContainer}>
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
    </TouchableWithoutFeedback>
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
    letterSpacing: "-0.5",
    fontSize: 20,
    color: colors.purple,
  },
  calendarContainer: { paddingHorizontal: 16 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  contentTitle: {
    fontFamily: "gamtanDotumB",
    color: colors.purple,
    letterSpacing: "-0.5",
    fontSize: 24,
    marginBottom: 16,
  },
  salesContainer: {
    flexGrow: 1,
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontFamily: "gamtanDotumB",
    fontSize: 16,
    letterSpacing: "-0.5",
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
    fontSize: 24,
    letterSpacing: "-0.5",
    color: colors.purple,
  },
});
