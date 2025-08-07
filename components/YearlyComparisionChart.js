import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const YearlyComparisonChart = () => {
  const data2024 = [420, 450, 500, 470, 495, 520, 510];
  const data2025 = [400, 420, 430, 460, 480, 540, 530];

  const labels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월"];

  const formatData = (arr, color) =>
    arr.map((value, index) => ({
      value,
      label: labels[index],
      hideDataPoint: true, // 점 안 보이게
      dataPointColor: color,
    }));

  return (
    <View>
      <LineChart
        data={formatData(data2024, "#8D4BE5")}
        data2={formatData(data2025, "#C12B7D")}
        width={300}
        height={200}
        spacing={40}
        xAxisLabelTextStyle={{ fontSize: 10, color: "grey" }}
        yAxisTextStyle={{ fontSize: 10, color: "grey" }}
        initialSpacing={0}
        showXAxisIndices
        xAxisIndicesHeight={10}
        xAxisIndicesWidth={1}
        xAxisIndicesColor={"#ccc"}
        xAxisLabelTexts={labels}
        thickness={2}
        thickness2={2}
        color1="#8D4BE5"
        color2="#C12B7D"
        curved
        hideDataPoints
        yAxisColor="#ccc"
        yAxisLabelWidth={40}
      />
    </View>
  );
};

export default YearlyComparisonChart;
