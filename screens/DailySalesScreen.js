import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
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

  // 👇 Animated 값
  const scrollY = useRef(new Animated.Value(1)).current; // 1=보임, 0=숨김
  const lastScrollY = useRef(0);

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

  // 👇 스크롤 방향 감지
  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY.current + 5) {
      // 위로 스크롤 → 타이틀 숨김
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentY < lastScrollY.current - 5) {
      // 아래로 스크롤 → 타이틀 보이기
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentY;
  };

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <DateHeader
        currentDate={date}
        onChangeDate={(newDateStr) => setDate(new Date(newDateStr))}
      />

      <View style={styles.contentContainer}>
        {/* 👇 스크롤에 따라 서서히 사라지는 타이틀 */}
        <Animated.Text
          style={[
            styles.contentTitle,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 50], // 스크롤 0~50px 구간
                    outputRange: [0, -30], // 위로 30px 밀림
                    extrapolate: "clamp",
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 50],
                outputRange: [1, 0], // 서서히 사라짐
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          오늘의 매출 {salesData?.length && `(${salesData?.length})`}
        </Animated.Text>

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator color={colors.purple} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Animated.ScrollView
              style={{ flex: 1 }}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
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
            </Animated.ScrollView>
          </View>
        )}

        <FloatingExpandButton style={styles.plusButton} date={date} />
      </View>

      <Animated.View
        style={[
          styles.totalContainer,
          Platform.OS === "android" && {
            borderColor: colors.backgroundPurple,
            borderWidth: 1,
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

  salesContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 64,
    gap: 12,
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
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(20),
    letterSpacing: -1.5,
    color: colors.purple,
  },
});
