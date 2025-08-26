import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const YearlyComparisonChart = ({ data }) => {
  // 색상 변수
  const LINE1_COLOR = "#36566C";
  const LINE2_COLOR = colors.purple;
  const FOCUS_POINT_COLOR = colors.alert;

  const [focusedPoint, setFocusedPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 50, y: 50 });
  const [focusedLineColor, setFocusedLineColor] = useState(LINE1_COLOR);

  const screenWidth = Dimensions.get("window").width;
  const containerWidth = screenWidth - 30; // BarChart와 동일하게 좌우 여백 제외
  const chartWidth = containerWidth - normalizeSize(60); // y축 라벨 여유 확보
  const chartHeight = normalizeSize(220);
  const yAxisLabelWidth = 60;

  const years = data ? Object.keys(data).sort() : [];

  const convertedData = {};
  years.forEach((year) => {
    convertedData[year] = (data[year] || []).map((val) => val / 10000);
  });

  const allValues = years.flatMap((year) => convertedData[year] || []);
  const maxRaw = allValues.length > 0 ? Math.max(...allValues) * 1.05 : 70;
  const maxValue = Math.ceil(maxRaw / 10) * 10;

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
    color: yearIdx === 0 ? LINE1_COLOR : LINE2_COLOR,
  }));

  const determineLineColor = (item) => {
    const firstLineData = formattedData[0]?.data || [];
    const monthIndex = labels.findIndex((label) => label === item.label);

    if (monthIndex !== -1 && firstLineData[monthIndex]) {
      if (Math.abs(firstLineData[monthIndex].value - item.value) < 0.001) {
        return LINE1_COLOR;
      }
    }
    return LINE2_COLOR;
  };

  const calculateTooltipPosition = (item) => {
    const initialSpacing = normalizeSize(24);
    const endSpacing = normalizeSize(20);

    const monthIndex = labels.findIndex((label) => label === item.label);
    if (monthIndex === -1) return { x: 50, y: 50 };

    const availableWidth = chartWidth - initialSpacing - endSpacing;
    const x =
      initialSpacing + (monthIndex * availableWidth) / (labels.length - 1);

    const valueRatio = item.value / maxValue;
    const y = chartHeight - valueRatio * chartHeight - 10;

    return {
      x: Math.max(10, Math.min(x, chartWidth)),
      y: Math.max(10, y),
    };
  };

  const renderCustomTooltip = () => {
    if (!focusedPoint) return null;

    return (
      <View
        style={[
          styles.tooltip,
          {
            left: tooltipPosition.x + 50,
            top: tooltipPosition.y + 10,
          },
        ]}
      >
        <Text style={[styles.tooltipText, { color: focusedLineColor }]}>
          {Number(focusedPoint.value).toFixed(0)}만원
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {renderCustomTooltip()}

      {/* 범례 */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <View
            style={[styles.legendCircle, { backgroundColor: LINE1_COLOR }]}
          />
          <Text style={styles.legendText}>{years[0]}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[styles.legendCircle, { backgroundColor: LINE2_COLOR }]}
          />
          <Text style={styles.legendText}>{years[1]}</Text>
        </View>
      </View>

      {formattedData.length > 0 && (
        <LineChart
          data={formattedData[0]?.data}
          data2={formattedData[1]?.data}
          width={normalizeSize(chartWidth)}
          height={normalizeSize(chartHeight)}
          adjustToWidth
          noOfSections={5}
          initialSpacing={normalizeSize(24)}
          endSpacing={normalizeSize(20)}
          spacing={normalizeSize(24)}
          thickness={2}
          thickness2={2}
          color1={LINE1_COLOR}
          color2={LINE2_COLOR}
          xAxisLabelTexts={labels}
          xAxisLabelTextStyle={styles.xAxisText}
          yAxisTextStyle={styles.yAxisText}
          yAxisThickness={0}
          yAxisLabelWidth={normalizeSize(yAxisLabelWidth + 20)}
          xAxisLength={normalizeSize(containerWidth - 100)}
          rulesLength={normalizeSize(containerWidth - 100)}
          xAxisThickness={1}
          xAxisColor={"#e9e3e9"}
          formatYLabel={(label) => `${Number(label)}만원`}
          hideDataPoints={false}
          dataPointsColor1={LINE1_COLOR}
          dataPointsColor2={LINE2_COLOR}
          maxValue={maxValue}
          startFillColor1={LINE1_COLOR}
          startFillColor2={LINE2_COLOR}
          startOpacity={0.8}
          endOpacity={0.3}
          areaChart1
          areaChart2
          focusEnabled
          focusTogether={false}
          focusedDataPointRadius={normalizeSize(6)}
          focusedDataPointColor={FOCUS_POINT_COLOR}
          onFocus={(item) => {
            setFocusedPoint(item);
            const lineColor = determineLineColor(item);
            setFocusedLineColor(lineColor);
            const position = calculateTooltipPosition(item);
            setTooltipPosition(position);
          }}
          onPressOut={() => setFocusedPoint(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    overflow: "visible",
  },
  tooltip: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 12,
    zIndex: 10,
    backgroundColor: colors.backgroundPurple,
    ...commonStyles.dropShadow,
  },
  tooltipText: {
    fontSize: normalizeFont(8),
    fontFamily: "nanumSquareB",
  },
  yAxisText: {
    fontSize: normalizeFont(10),
    fontFamily: "nanumSquareB",
    color: colors.purple,
  },
  xAxisText: {
    fontSize: normalizeFont(8),
    fontFamily: "nanumSquareB",
    letterSpacing: -0.5,
    color: "#000",
  },
  legendCircle: {
    width: normalizeSize(12),
    height: normalizeSize(12),
    marginRight: 4,
    borderRadius: 12,
  },
  legendText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
  },
});

export default YearlyComparisonChart;
