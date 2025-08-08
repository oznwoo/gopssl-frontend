import React from "react";
import { Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import colors from "../styles/color";

function toManWon(amount) {
  const man = amount / 10000;
  return Number.isInteger(man) ? man : Number(man.toFixed(1));
}

const SalesBarChart = ({ data }) => {
  const values = data?.map((item) => item.total / 10000) || [];

  // 최대값에 5% 여유를 더하고 10단위로 올림
  const maxRaw = values.length > 0 ? Math.max(...values) * 1.05 : 70;
  const maxValue = Math.ceil(maxRaw / 10) * 10;

  // 평균값 계산 (값이 없으면 0)
  const average =
    values.length > 0
      ? (values.reduce((acc, val) => acc + val, 0) / values.length).toFixed(1)
      : 0;

  // topLabelComponent를 각 데이터에 넣어 커스텀 텍스트 표시
  const datas = data?.map((item, index) => {
    const isLast = index === data.length - 1;
    const manWonValue = item.total / 10000;
    const displayValue = Number.isInteger(manWonValue)
      ? manWonValue
      : Number(manWonValue.toFixed(1));

    return {
      value: displayValue,
      label: `${item.month}월`,
      frontColor: isLast ? colors.purple : colors.secondPurple,
      topLabelComponent: () => (
        <Text style={[styles.topLabelText, isLast && { color: "#fff" }]}>
          {displayValue}만원
        </Text>
      ),
      topLabelContainerStyle: [
        styles.topLabelContainer,
        isLast && { backgroundColor: colors.purple },
      ],
    };
  });

  return (
    <BarChart
      data={datas}
      width={280}
      height={200}
      barWidth={30}
      barBorderTopRightRadius={8}
      barBorderTopLeftRadius={8}
      spacing={28}
      initialSpacing={60}
      endSpacing={30}
      adjustToWidth
      isAnimated
      maxValue={maxValue} // 데이터 최대값 기준 10단위 올림
      noOfSections={5} // 10 단위 눈금 수
      yAxisThickness={0}
      xAxisThickness={0}
      xAxisLabelTextStyle={styles.xAxisText}
      yAxisTextStyle={styles.yAxisText}
      formatYLabel={(label) => `${label}만원`}
      rulesColor={"#e9e3e9"}
      rulesThickness={1}
      showReferenceLine1
      referenceLine1Position={average}
      referenceLine1Config={{
        color: colors.alert,
        dashWidth: 4,
        labelText: `평균(${average}만원)`,
        labelTextStyle: styles.referenceText,
      }}
      referenceLinesOverChartContent={false}
      showValuesOnTopOfBars={false}
    />
  );
};

export default SalesBarChart;

const styles = StyleSheet.create({
  yAxisText: {
    fontFamily: "nanumSquareB",
    fontSize: 10,
    color: colors.purple,
  },
  xAxisText: {
    fontFamily: "gamtanBatangB",
    fontSize: 12,
    letterSpacing: 1,
    color: colors.purple,
  },
  topLabelContainer: {
    width: 56,
    height: 20,
    alignSelf: "center",
    backgroundColor: colors.secondPurple,
    padding: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  topLabelText: {
    color: "#322C58",
    fontFamily: "nanumSquareB",
    fontSize: 8,
  },
  referenceText: {
    color: colors.alert,
    fontFamily: "gamtanDotumB",
    fontSize: 10,
    marginVertical: 4,
  },
});
