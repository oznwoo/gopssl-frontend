import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";

const YearlyComparisonChart = ({ data }) => {
  // 색상 변수로 관리 - 이곳에서 쉽게 변경 가능
  const LINE1_COLOR = "#36566C";
  const LINE2_COLOR = colors.purple;
  const FOCUS_POINT_COLOR = colors.alert;

  const [focusedPoint, setFocusedPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 50, y: 50 });
  const [focusedLineColor, setFocusedLineColor] = useState(LINE1_COLOR);

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
    color: yearIdx === 0 ? LINE1_COLOR : LINE2_COLOR, // 변수 사용
  }));

  // 어느 라인이 포커스되었는지 확인하는 함수
  const determineLineColor = (item) => {
    // 첫 번째 라인의 데이터와 비교
    const firstLineData = formattedData[0]?.data || [];
    const monthIndex = labels.findIndex((label) => label === item.label);

    if (monthIndex !== -1 && firstLineData[monthIndex]) {
      // 포커스된 값이 첫 번째 라인의 해당 월 값과 일치하는지 확인
      if (Math.abs(firstLineData[monthIndex].value - item.value) < 0.001) {
        return LINE1_COLOR; // 첫 번째 라인 색상 변수 사용
      }
    }

    return LINE2_COLOR; // 두 번째 라인 색상 변수 사용
  };

  // 툴팁 위치 계산 함수
  const calculateTooltipPosition = (item) => {
    const chartWidth = 300;
    const chartHeight = 220;
    const initialSpacing = 24;
    const endSpacing = 32;

    const monthIndex = labels.findIndex((label) => label === item.label);
    if (monthIndex === -1) return { x: 50, y: 50 };

    // X 위치 계산
    const availableWidth = chartWidth - initialSpacing - endSpacing;
    const x =
      initialSpacing + (monthIndex * availableWidth) / (labels.length - 1);

    // Y 위치 계산
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
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            backgroundColor: focusedLineColor, // 동적 색상 적용
          },
        ]}
      >
        <Text style={styles.tooltipText}>{focusedPoint.value}만원</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCustomTooltip()}

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
          width={300}
          height={220}
          adjustToWidth
          noOfSections={5}
          initialSpacing={24}
          endSpacing={20}
          spacing={24}
          thickness={2}
          thickness2={2}
          color1={LINE1_COLOR} // 변수 사용
          color2={LINE2_COLOR} // 변수 사용
          xAxisLabelTexts={labels}
          xAxisLabelTextStyle={styles.xAxisText}
          yAxisTextStyle={styles.yAxisText}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={"#e9e3e9"}
          formatYLabel={(label) => `${label}만원`}
          hideDataPoints={false}
          dataPointsColor1={LINE1_COLOR} // 변수 사용
          dataPointsColor2={LINE2_COLOR} // 변수 사용
          maxValue={maxValue}
          startFillColor1={LINE1_COLOR} // 변수 사용
          startFillColor2={LINE2_COLOR} // 변수 사용
          startOpacity={0.8}
          endOpacity={0.3}
          areaChart1
          areaChart2
          // 포커스 설정
          focusEnabled
          focusTogether={false}
          focusedDataPointRadius={6}
          focusedDataPointColor={FOCUS_POINT_COLOR} // 변수 사용
          // 커스텀 포커스 처리
          onFocus={(item) => {
            setFocusedPoint(item);
            const lineColor = determineLineColor(item);
            setFocusedLineColor(lineColor);
            const position = calculateTooltipPosition(item);
            setTooltipPosition(position);
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 10,
    ...commonStyles.dropShadow,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: "nanumSquareB",
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
  legendCircle: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 12,
  },
  legendText: {
    fontFamily: "nanumSquareB",
    fontSize: 12,
  },
});

export default YearlyComparisonChart;
