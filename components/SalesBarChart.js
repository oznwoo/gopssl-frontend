import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import colors from "../styles/color";

function toManWon(amount) {
  const man = amount / 10000;
  return Number.isInteger(man) ? man : man.toFixed(1);
}

const SalesBarChart = ({ data }) => {
  const datas = data?.map((item, index) => {
    const isLast = index === data.length - 1;

    return {
      value: toManWon(item.total),
      label: `${item.month}월`,
      frontColor: isLast ? colors.purple : colors.lightPurple,
    };
  });

  // const datas = [
  //   { value: 202, label: "4월", frontColor: "#c9b7e5" },
  //   { value: 305, label: "5월", frontColor: "#c9b7e5" },
  //   { value: 395, label: "6월", frontColor: "#c9b7e5" },
  //   { value: 300, label: "7월", frontColor: "#6E2FB4" }, // 강조 색상
  // ];
  const average = 40;

  return (
    <View>
      <BarChart
        barWidth={30}
        barBorderRadius={8}
        frontColor="#c9b7e5"
        data={datas}
        maxValue={70}
        noOfSections={5}
        spacing={30}
        showValuesOnTopOfBars
        yAxisThickness={0}
        xAxisLabelTextStyle={{ color: "#6e6e6e", fontSize: 12 }}
        yAxisTextStyle={{ color: "#6e6e6e" }}
        isAnimated
        referenceLinePosition="custom"
        referenceLineValue={average}
        referenceLineConfig={{
          color: "#C12B7D",
          type: "dashed",
          width: 2,
        }}
      />
    </View>
  );
};

export default SalesBarChart;
