import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Animated,
  PanResponder,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DailySalesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [salesData, setSalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeDate = useCallback((offset) => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + offset);
      return newDate;
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          changeDate(-1);
        } else if (gestureState.dx < -50) {
          changeDate(1);
        }
      },
    })
  ).current;

  // 👇 Animated 값
  const scrollY = useRef(new Animated.Value(0)).current;

  const transitionCustomer = useCallback(
    (itemId = undefined) => {
      navigation.navigate("Customer", { mode: "view", itemId });
    },
    [navigation]
  );

  const transitionSale = useCallback(
    (itemId = undefined) => {
      navigation.navigate("Sale", {
        saleDate: date.toISOString(),
        mode: "view",
        itemId,
      });
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

  useEffect(() => {
    fetchSalesData();
  }, [date, fetchSalesData]);

  useFocusEffect(
    useCallback(() => {
      fetchSalesData();
    }, [fetchSalesData])
  );

  return (
    <View style={styles.pageContainer}>
      <View style={{ paddingTop: insets.top }}>
        <DateHeader
          currentDate={date}
          onChangeDate={(newDateStr) => setDate(new Date(newDateStr))}
        />
      </View>

      <View style={styles.contentContainer}>
        {/* 👇 스크롤에 따라 서서히 사라지는 타이틀 */}
        <Animated.Text
          style={[
            styles.contentTitle,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, -30],
                    extrapolate: "clamp",
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 50],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          오늘의 매출 {salesData?.length && `(${salesData?.length})`}
        </Animated.Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={colors.purple} />
          </View>
        ) : (
          <Animated.ScrollView
            style={{ flex: 1 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false } // opacity / transform 만 애니메이션
            )}
            contentContainerStyle={[
              styles.salesContainer,
              { justifyContent: salesData ? "flex-start" : "center" },
            ]}
            {...panResponder.panHandlers}
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
              <Text style={styles.emptyText}>매출이 등록되지 않았습니다.</Text>
            )}
          </Animated.ScrollView>
        )}

        <FloatingExpandButton
          date={date}
          style={[styles.plusButton]}
          transform={[
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 30],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
      </View>

      {/* 👇 합계 영역 → 스크롤 따라 translateY & opacity */}
      <Animated.View
        style={[
          styles.totalContainer,
          Platform.OS === "android" && {
            borderColor: colors.backgroundPurple,
            borderWidth: 1,
          },
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 30],
                  extrapolate: "clamp",
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <Text style={styles.totalText}>
          합계:
          {salesData
            ? formatNumber(
                salesData.reduce((acc, curr) => acc + curr.total_amount, 0)
              )
            : 0}
          원
        </Text>
      </Animated.View>
    </View>
  );
};

export default DailySalesScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  contentContainer: {
    flex: 1,
  },
  contentTitle: {
    width: "90%",
    position: "absolute",
    top: 12,
    zIndex: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 12,
    fontFamily: "nanumSquareB",
    color: colors.purple,
    letterSpacing: -1.5,
    fontSize: normalizeFont(18),
    ...commonStyles.lightDropShadow,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  salesContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 64,
    gap: 8,
  },
  emptyText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.lightPurple,
  },
  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 64,
    ...commonStyles.dropShadow,
  },
  totalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOffset: { width: 0, height: -1 },
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalText: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(20),
    letterSpacing: -1,
    color: colors.purple,
  },
});
