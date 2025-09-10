import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import DateHeader from "../components/DateHeader";
import SalesBarChart from "../components/SalesBarChart";
import YearlyComparisonChart from "../components/YearlyComparisionChart";
import { getMonthlySalesSummary } from "../actions/saleStatisticsActions";
import { normalizeFont, normalizeSize } from "../utils/responsive";
import { formatNumber } from "../utils/format";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedText from "../components/AnimatedText";

const SalesComparisionScreen = (props) => {
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState(new Date());
  const [statisticsData, setStatisticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const data = await getMonthlySalesSummary(year, month);
        setStatisticsData({ ...data }); // 새 객체로 변경
      } catch (e) {
        console.error("매출 요약 조회 실패:", e);
        setStatisticsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const renderContent = () => {
    if (isLoading || !statisticsData) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.purple} />
        </View>
      );
    }

    const thisMonthData =
      statisticsData?.monthly_comparison?.[
        statisticsData.monthly_comparison.length - 1
      ];
    const lastMonthSale = statisticsData?.last_month_until_today_total;
    const difference = thisMonthData.total - lastMonthSale;
    const percentage =
      lastMonthSale &&
      ((Math.abs(difference) / lastMonthSale) * 100).toFixed(2);

    const comparisionTextColor = difference > 0 ? colors.green : "#FF6B57";

    const cashCount = statisticsData?.payment_type_count?.["현금"] ?? 0;
    const cardCount = statisticsData?.payment_type_count?.["카드"] ?? 0;
    const totalCount = cashCount + cardCount;

    const cashRatio = cashCount / totalCount;
    const cardRatio = cardCount / totalCount;

    return (
      <ScrollView
        horizontal={false}
        contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}
      >
        <View style={{ width: "100%", flexDirection: "row", gap: 16 }}>
          <View style={[styles.infoBox, { backgroundColor: colors.purple }]}>
            <Text style={[styles.boxTitle, { color: "#fff" }]}>
              이달의 매출
            </Text>
            <View
              style={[
                styles.boxContent,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
              ]}
            >
              <Text style={styles.monthTotal}>
                {thisMonthData ? formatNumber(thisMonthData.total) : 0}원
              </Text>
              {lastMonthSale !== 0 && (
                <View style={[styles.comparisonContainer]}>
                  <AnimatedText
                    texts={[
                      `${percentage}% ${difference > 0 ? "↑" : "↓"}`,
                      `${formatNumber(difference)}원 ${
                        difference > 0 ? "↑" : "↓"
                      }`,
                    ]}
                    style={[
                      styles.comparisionText,
                      { color: comparisionTextColor },
                    ]}
                    textHeight={12}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={[styles.infoBox, { backgroundColor: "#fff" }]}>
            <Text style={styles.boxTitle}>매출 유형</Text>
            <View style={styles.typeLegend}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <View
                  style={[
                    styles.legendCircle,
                    { backgroundColor: colors.purple },
                  ]}
                />
                <Text style={styles.legendText}>현금</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.legendCircle,
                    {
                      backgroundColor: colors.backgroundPurple,
                      borderColor: colors.purple,
                      borderWidth: 0.5,
                    },
                  ]}
                />
                <Text style={styles.legendText}>카드</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              {cardRatio || cashRatio ? (
                <View style={styles.typeChart}>
                  <View
                    style={[
                      styles.typeRatio,
                      {
                        flex: cashRatio,
                        backgroundColor: colors.purple,
                        position: "relative",
                      },
                    ]}
                  >
                    <AnimatedText
                      texts={[
                        `${(cashRatio * 100).toFixed(0)}%`,
                        `${cashCount}명`,
                      ]}
                      style={[
                        styles.typeRatioText,
                        { color: "#fff", position: "absolute", left: 8 },
                      ]}
                      textHeight={12}
                      numberOfLines={1}
                    />
                  </View>
                  <View
                    style={[
                      styles.typeRatio,
                      {
                        flex: cardRatio,
                        backgroundColor: colors.backgroundPurple,
                        alignItems: "flex-end",
                        position: "relative",
                      },
                    ]}
                  >
                    <AnimatedText
                      texts={[
                        `${(cardRatio * 100).toFixed(0)}%`,
                        `${cardCount}명`,
                      ]}
                      style={[
                        styles.typeRatioText,
                        {
                          color: colors.purple,
                          position: "absolute",
                          right: 8,
                        },
                      ]}
                      textHeight={12}
                      numberOfLines={1}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={
                    ([styles.typeChart],
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                    })
                  }
                >
                  <Text style={styles.boxDetail}>
                    아직 매출이 등록되지 않았습니다.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.comparisionBox}>
          <View style={{ gap: 12, margin: 8 }}>
            <Text style={styles.boxTitle}>매출 비교</Text>
            <Text style={styles.boxDetail}>
              아래의 지표는 곱슬머리가 매달 1일부터 현재일까지를 비교한
              지표입니다.
            </Text>
          </View>
          <View style={styles.chartContainer}>
            {statisticsData.monthly_comparison &&
              statisticsData.monthly_comparison.length > 0 && (
                <SalesBarChart
                  key={`bar-${date.toISOString()}`}
                  data={statisticsData.monthly_comparison}
                />
              )}
          </View>
        </View>

        <View style={styles.comparisionBox}>
          <View style={{ gap: 12, margin: 4 }}>
            <Text style={styles.boxTitle}>연도별 비교</Text>
            <Text style={styles.boxDetail}>
              연도별 매출 추이를 확인할 수 있습니다.
            </Text>
          </View>
          <View style={styles.chartContainer}>
            {statisticsData?.yearly_comparison &&
              Object.keys(statisticsData.yearly_comparison).length > 0 && (
                <YearlyComparisonChart
                  key={`line-${date.toISOString()}`}
                  data={{ ...statisticsData.yearly_comparison }}
                />
              )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <DateHeader
          onlyCalendar={true}
          currentDate={date}
          onChangeDate={(newDateStr) => {
            setDate(new Date(newDateStr));
          }}
        />
      </View>
      {renderContent()}
    </View>
  );
};

export default SalesComparisionScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundPurple,
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: colors.backgroundPurple,
    ...commonStyles.lightDropShadow,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    width: "100%",
  },
  infoBox: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    ...commonStyles.dropShadow,
  },
  boxContent: { flex: 1, gap: 4, justifyContent: "center" },
  typeLegend: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
  },
  legendCircle: {
    width: normalizeSize(10),
    height: normalizeSize(10),
    marginRight: 4,
    borderRadius: 12,
  },
  legendText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
  },
  typeChart: {
    marginTop: 4,
    height: 28,
    width: "100%",
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
  },
  typeRatio: {
    flex: 1,
    justifyContent: "center",
    minWidth: normalizeSize(30),
  },
  typeRatioText: {
    fontSize: normalizeFont(12),
    fontFamily: "nanumSquareB",
    letterSpacing: -0.5,
  },
  boxTitle: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
    letterSpacing: -0.5,
    color: colors.purple,
  },
  boxDetail: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
    letterSpacing: -0.5,
    color: "#656d72",
  },
  chartContainer: {
    maxWidth: "100%",
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  monthTotal: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(18),
    color: "#fff",
    letterSpacing: -1,
  },
  comparisionText: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(12),
    letterSpacing: -1,
  },
  comparisonContainer: {
    paddingHorizontal: 4,
    flexDirection: "row",
    borderRadius: 8,
    gap: 4,
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  comparisionBox: {
    maxWidth: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    ...commonStyles.dropShadow,
  },
});
