import React from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import colors from "../styles/color";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const SalesBarChart = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  // 차트 컨테이너 너비
  const containerWidth = screenWidth - 30;

  const values = data?.map((item) => item.total / 10000) || [];

  // 최대값에 5% 여유를 더하고 10단위로 올림
  const maxRaw = values.length > 0 ? Math.max(...values) * 1.05 : 70;
  const maxValue = Math.ceil(maxRaw / 10) * 10;

  // 평균값 계산 (값이 없으면 0)
  const average =
    values.length > 0
      ? (values.reduce((acc, val) => acc + val, 0) / values.length).toFixed(1)
      : 0;

  // Y축 레이블 너비 계산 (대략적으로)
  const yAxisLabelWidth = 60;
  // 실제 차트 영역 너비
  const chartWidth = containerWidth - yAxisLabelWidth;

  // topLabelComponent를 각 데이터에 넣어 커스텀 텍스트 표시
  const datas = data?.map((item, index) => {
    const isLast = index === data.length - 1;
    const manWonValue = item.total / 10000;
    const displayValue = Number.isInteger(manWonValue)
      ? manWonValue
      : Number(manWonValue).toFixed(0);

    return {
      value: displayValue,
      label: `${item.month}월`,
      frontColor: isLast ? colors.purple : colors.secondPurple,
      topLabelComponent: () => (
        <Text style={[styles.topLabelText, isLast && { color: colors.purple }]}>
          {displayValue}만원
        </Text>
      ),
      topLabelContainerStyle: [styles.topLabelContainer],
    };
  });

  return (
    <View style={[styles.chartContainer, { width: containerWidth }]}>
      <BarChart
        data={datas}
        width={normalizeSize(chartWidth)}
        height={normalizeSize(220)}
        barWidth={normalizeSize(32)}
        barBorderTopRightRadius={8}
        barBorderTopLeftRadius={8}
        spacing={normalizeSize(36)}
        initialSpacing={normalizeSize(32)}
        endSpacing={normalizeSize(30)}
        isAnimated
        maxValue={maxValue}
        noOfSections={5}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={"#e9e3e9"}
        xAxisLabelTextStyle={styles.xAxisText}
        yAxisTextStyle={styles.yAxisText}
        yAxisLabelWidth={normalizeSize(yAxisLabelWidth + 20)}
        xAxisLength={normalizeSize(containerWidth - 100)}
        formatYLabel={(label) => `${label}만원`}
        rulesColor={"#e9e3e9"}
        rulesThickness={1}
        // 눈금선 길이 제한
        rulesLength={normalizeSize(containerWidth - 100)} // initialSpacing과 endSpacing 고려
        showReferenceLine1
        referenceLine1Position={average}
        referenceLine1Config={{
          color: colors.alert,
          dashWidth: 4,
          labelText: `평균(${Number(average)}만원)`,
          labelTextStyle: styles.referenceText,
          width: normalizeSize(containerWidth - 100),
        }}
        referenceLinesOverChartContent={false}
        showValuesOnTopOfBars={false}
      />
    </View>
  );
};

export default SalesBarChart;

const styles = StyleSheet.create({
  chartContainer: {
    overflow: "visible",
    alignSelf: "center",
  },
  yAxisText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
    color: colors.purple,
  },
  xAxisText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: "#000",
  },
  topLabelContainer: {
    width: normalizeSize(56),
    height: normalizeSize(40),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  topLabelText: {
    color: "#656d72",
    backgroundColor: colors.backgroundPurple,
    borderRadius: 4,
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(8),
  },
  referenceText: {
    color: colors.alert,
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(10),
    marginVertical: 4,
  },
});
