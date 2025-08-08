import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const YearlyComparisonChart = ({ data }) => {
  // data가 객체인지 확인하고, 없으면 빈 객체 할당
  const years = data ? Object.keys(data).sort() : [];

  // 월 레이블 (1~12월)
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

  // 각 연도별 데이터를 line chart 형식에 맞게 가공
  const formattedData = years.map((year, index) => ({
    id: year,
    data: (data[year] || []).map((value, idx) => ({
      value,
      label: labels[idx],
      hideDataPoint: true,
      // 예시 색상, 배열 순서에 따라 다르게 설정 가능
      dataPointColor: index === 0 ? "#8D4BE5" : "#C12B7D",
    })),
    color: index === 0 ? "#8D4BE5" : "#C12B7D",
  }));

  return (
    <View>
      {formattedData.length > 0 && (
        <LineChart
          data={formattedData[0].data}
          data2={formattedData[1]?.data}
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
      )}
    </View>
  );
};

export default YearlyComparisonChart;
