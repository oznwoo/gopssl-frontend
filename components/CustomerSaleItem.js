import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalizeFont } from "../utils/responsive";
import { formatNumber } from "../utils/format";
import colors from "../styles/color";

const CustomerSaleItem = ({ item, transitionSale }) => {
  return (
    <TouchableOpacity
      key={item.id}
      style={styles.saleItemContainer}
      onPress={() => {
        transitionSale(item.id, item.created_at);
      }}
    >
      <View style={styles.tableRow}>
        {/* 방문일 컬럼 - 헤더와 동일한 flex: 1 */}
        <View
          style={[
            styles.tableColumn,
            { minHeight: 20, justifyContent: "center" },
          ]}
        >
          <Text style={styles.dateText}>{item.sale_date}</Text>
        </View>

        {/* 시술 목록 컬럼 - 헤더와 동일한 flex: 1 */}
        <View style={[styles.tableColumn, { gap: 2 }]}>
          {item.treatments.map((treatment, index) => (
            <Text key={index} style={styles.treatmentText}>
              {treatment.treatment_name}
            </Text>
          ))}
          {Object.keys(item.extra_prices).length !== 0 &&
            Object.keys(item.extra_prices).map((key) => {
              return (
                <Text key={key} style={styles.treatmentText}>
                  {key === "제품" ? key : `기장추가(${key})`}
                </Text>
              );
            })}
        </View>

        {/* 시술 내용 컬럼 - 헤더와 동일한 flex: 1 */}
        <View style={[styles.tableColumn, { maxWidth: "25%" }]}>
          <Text style={styles.memoText} numberOfLines={4}>
            {item.detail}
          </Text>
        </View>

        {/* 합계 컬럼 - 헤더와 동일한 flex: 1 */}
        <View
          style={[
            styles.tableColumn,
            { minHeight: 20, justifyContent: "center", borderRightWidth: 0 },
          ]}
        >
          <Text style={styles.totalText}>
            {formatNumber(item.total_amount)}원
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerSaleItem;

const styles = StyleSheet.create({
  saleItemContainer: { paddingVertical: 2, width: "110%", alignSelf: "center" },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#00000008",
    borderRadius: 8,
    paddingVertical: 4,
  },
  tableColumn: {
    flex: 1, // 헤더와 동일한 flex: 1
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderColor: "#00000055",
    height: "100%",
  },
  dateText: {
    width: "100%",
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(11),
    color: "#000",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  treatmentText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(9),
    color: "#000",
    letterSpacing: -0.5,
    lineHeight: 12,
    textAlign: "center",
  },
  priceText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(9),
    color: "#000",
    letterSpacing: -0.5,
    lineHeight: 12,
    textAlign: "center",
  },
  memoText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(8),
    color: "#333",
    lineHeight: 10,
    textAlign: "center",
    marginTop: 2,
  },
  totalText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(11),
    color: "#000",
    letterSpacing: -0.5,
    textAlign: "center",
  },
});
