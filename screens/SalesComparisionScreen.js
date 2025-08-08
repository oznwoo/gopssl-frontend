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

const SalesComparisionScreen = (props) => {
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
        <View style={styles.pageContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
        </View>
      );
    }

    const thisMonthData =
      statisticsData?.monthly_comparison?.[
        statisticsData.monthly_comparison.length - 1
      ];
    const lastMonthData =
      statisticsData?.monthly_comparison?.[
        statisticsData.monthly_comparison.length - 2
      ];
    const difference = thisMonthData.total - lastMonthData.total;
    const comparisionTextColor =
      difference === 0 ? "#fff" : difference > 0 ? colors.green : "#EB6051";

    const cashRatio = statisticsData?.payment_type_ratio?.["현금"] ?? 0;
    const cardRatio = statisticsData?.payment_type_ratio?.["카드"] ?? 0;

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
            <View style={styles.boxContent}>
              <Text style={styles.monthTotal}>
                {thisMonthData ? (thisMonthData.total / 10000).toFixed(1) : 0}
                만원
              </Text>

              <Text
                style={[
                  styles.comparisionText,
                  { color: comparisionTextColor },
                ]}
              >
                {difference === 0
                  ? "(지난달과 동일한 매출)"
                  : `(지난 달 대비 ${(Math.abs(difference) / 10000).toFixed(
                      1
                    )}만원${difference > 0 ? "↑" : "↓"})`}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.backgroundPurple },
            ]}
          >
            <Text style={styles.boxTitle}>매출 유형</Text>
            <View style={styles.boxContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <Text style={styles.typeText}>현금</Text>
                <Text style={styles.typeText}>카드</Text>
              </View>
              <View style={styles.typeChart}>
                <View
                  style={[
                    styles.typeRatio,
                    {
                      flex: cashRatio,
                      backgroundColor: colors.purple,
                    },
                  ]}
                >
                  <Text style={[styles.typeRatioText, { color: "#fff" }]}>
                    {(cashRatio * 100).toFixed(0)}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.typeRatio,
                    {
                      flex: cardRatio,
                      backgroundColor: "#fff",
                      alignItems: "flex-end",
                    },
                  ]}
                >
                  <Text
                    style={[styles.typeRatioText, { color: colors.purple }]}
                  >
                    {(cardRatio * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
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
      <View style={styles.headerContainer}>
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
    backgroundColor: "#fff",
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    width: "100%",
  },
  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.lightPurple,
    padding: 16,
    gap: 12,
    ...commonStyles.dropShadow,
  },
  boxContent: { flex: 1, gap: 4, justifyContent: "center" },
  typeText: {
    fontFamily: "gamtanDotumR",
    fontSize: 12,
    letterSpacing: "1",
    color: colors.purple,
  },
  typeChart: {
    marginTop: 4,
    height: 28,
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
  },
  typeRatio: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  typeRatioText: {
    fontSize: 12,
    fontFamily: "nanumSquareB",
  },
  boxTitle: {
    fontFamily: "gamtanDotumB",
    fontSize: 16,
    letterSpacing: "-0.5",
    color: colors.purple,
  },
  boxDetail: {
    fontFamily: "nanumSquareB",
    fontSize: 10,
    letterSpacing: "-0.5",
    color: "#656d72",
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  monthTotal: {
    fontFamily: "gamtanDotumB",
    fontSize: 18,
    color: "#fff",
    letterSpacing: "-0.5",
  },
  comparisionText: {
    fontFamily: "gamtanDotumB",
    fontSize: 12,
    letterSpacing: "-0.5",
    color: "#fff",
  },
  comparisionBox: {
    backgroundColor: colors.backgroundPurple,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    ...commonStyles.dropShadow,
  },
});
