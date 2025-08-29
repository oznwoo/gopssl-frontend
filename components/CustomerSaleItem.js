import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalizeFont } from "../utils/responsive";
import colors from "../styles/color";
import { formatKoreanDate, formatNumber } from "../utils/format";

const CustomerSaleItem = ({ item, transitionSale }) => {
  const treatmentText = item.treatments
    .map((item) => `${item.treatment_name}: ${formatNumber(item.price)}원`)
    .join(", ");

  const extraPriceText =
    Object.keys(item.extra_prices).length !== 0
      ? Object.keys(item.extra_prices)
          .map((key) => {
            return key === "제품"
              ? `${key}: ${formatNumber(item.extra_prices[key])}원`
              : `기장추가(${key}): ${formatNumber(item.extra_prices[key])}원`;
          })
          .join(", ")
      : "기장추가: 없음";

  return (
    <View key={item.id} style={styles.saleItemContainer}>
      <View style={styles.saleContentContainer}>
        <Text style={styles.dateText}>{formatKoreanDate(item.created_at)}</Text>
        <View style={{ gap: 4 }}>
          <Text style={styles.detailText}>{treatmentText}</Text>
          <Text style={styles.detailText}>{extraPriceText}</Text>
          <Text style={styles.detailText}>결재 방식: {item.payment_type}</Text>
        </View>

        <Text style={[styles.detailText, { fontSize: normalizeFont(16) }]}>
          매출: {formatNumber(item.total_amount)}원
        </Text>
      </View>
      {item.detail && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>시술 내용</Text>
          <Text style={styles.detailContentText}>{item.detail}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.saleInfoButton}
        onPress={() => {
          transitionSale(item.id, item.created_at);
        }}
      >
        <FontAwesome5 name="chevron-right" size={24} color={colors.purple} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomerSaleItem;

const styles = StyleSheet.create({
  saleItemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,

    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,

    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  saleContentContainer: {
    flex: 1,
    gap: 8,
    flexShrink: 0,
  },
  dateText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(20),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  detailText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  detailContainer: {
    maxWidth: "30%",
    height: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.purple,
    borderRadius: 8,
    padding: 8,
    gap: 12,
  },
  detailContentText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(10),
    color: "#000",
    lineHeight: 12,
  },
  saleInfoButton: {
    paddingLeft: 8,
  },
});
