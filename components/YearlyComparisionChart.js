import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import colors from "../styles/color";

const YearlyComparisonChart = ({ data }) => {
  const [focusedPoint, setFocusedPoint] = useState(null);

  const years = data ? Object.keys(data).sort() : [];

  const convertedData = {};
  years.forEach((year) => {
    convertedData[year] = (data[year] || []).map((val) => val / 10000);
  });

  const allValues = years.flatMap((year) => convertedData[year] || []);
  const maxRaw = allValues.length > 0 ? Math.max(...allValues) * 1.05 : 100;
  const maxValue = Math.ceil(maxRaw * 10) / 10;

  const labels = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const formattedData = years.map((year, yearIdx) => ({
    id: year,
    data: (convertedData[year] || []).map((value, idx) => ({
      value,
      label: labels[idx],
    })),
    color: yearIdx === 0 ? colors.purple : colors.secondPurple,
  }));

  const renderCustomTooltip = () => {
    if (!focusedPoint) return null;

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{focusedPoint.value}만원</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCustomTooltip()}

      {formattedData.length > 0 && (
        <LineChart
          data={formattedData[0].data}
          data2={formattedData[1]?.data}
          width={300}
          height={220}
          adjustToWidth
          noOfSections={5}
          initialSpacing={24}
          endSpacing={20}
          spacing={24}
          thickness={2}
          thickness2={2}
          curved
          color1={colors.purple}
          color2={colors.secondPurple}
          xAxisLabelTexts={labels}
          xAxisLabelTextStyle={styles.xAxisText}
          yAxisTextStyle={styles.yAxisText}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={"#e9e3e9"}
          formatYLabel={(label) => `${label}만원`}
          hideDataPoints={false}
          dataPointsColor1={colors.purple}
          dataPointsColor2={colors.secondPurple}
          maxValue={maxValue}
          startFillColor1={colors.purple}
          startFillColor2={colors.secondPurple}
          startOpacity={0.8}
          endOpacity={0.3}
          areaChart1
          areaChart2
          // 포커스
          focusEnabled
          showStripOnFocus
          focusedDataPointRadius={8}
          focusedDataPointColor={colors.alert}
          // 커스텀 포커스 처리
          onFocus={(item) => {
            setFocusedPoint(item);
          }}
          onPressOut={() => {
            setFocusedPoint(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    overflow: "visible",
  },
  tooltip: {
    position: "absolute",
    top: 10,
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  yAxisText: {
    fontSize: 10,
    fontFamily: "nanumSquareB",
    color: colors.purple,
  },
  xAxisText: {
    fontSize: 8,
    fontFamily: "nanumSquareB",
    letterSpacing: -0.5,
    color: "#000",
  },
});

export default YearlyComparisonChart;
