import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { formatNumber } from "../utils/format";
import { normalizeFont } from "../utils/responsive";

const SaleItem = ({ saleData, transitionSale, transitionCustomer }) => {
  const isFirstVisit = saleData.num_of_visits === 1;
  const textColor = isFirstVisit ? "#fff" : colors.purple;
  const detailBgColor = isFirstVisit
    ? colors.darkPurple
    : colors.backgroundPurple;
  const cardBgColor = isFirstVisit ? colors.purple : "#fff";
  const numOfVisitColor = isFirstVisit
    ? { color: "#76B4A0", fontFamily: "nanumSquareEB" }
    : { color: colors.purple, fontFamily: "nanumSquareR" };

  console.log(saleData);

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor: cardBgColor,
        },
      ]}
      onPress={() => transitionSale(saleData.id)}
    >
      <View style={styles.customerInfo}>
        <TouchableOpacity
          style={styles.customerTitle}
          onPress={() => transitionCustomer(saleData.customer_id)}
        >
          <Text style={[styles.numOfVisit, numOfVisitColor]}>
            {saleData.num_of_visits === 1
              ? "첫 방문"
              : `${saleData.num_of_visits}회 방문`}
          </Text>
          <Text style={[styles.customerName, { color: textColor }]}>
            <Text
              style={[styles.customerName, { fontFamily: "nanumSquareEB" }]}
            >
              {saleData.customer_name}
            </Text>
            {" 고객님"}
          </Text>
        </TouchableOpacity>

        <View style={styles.detailBox}>
          {saleData.treatments.map((item) => {
            return (
              <Text
                key={item.id}
                style={[
                  styles.detailText,
                  { color: textColor, backgroundColor: detailBgColor },
                ]}
              >
                {item.treatment_name}
              </Text>
            );
          })}

          {Object.keys(saleData.extra_prices).length !== 0 &&
            Object.keys(saleData.extra_prices).map((key) => {
              return (
                <Text
                  key={key}
                  style={[
                    styles.detailText,
                    { color: textColor, backgroundColor: detailBgColor },
                  ]}
                >
                  {key === "제품" ? `${key}` : `기장추가(${key})`}
                </Text>
              );
            })}

          <Text
            style={[
              styles.detailText,
              { color: textColor, backgroundColor: detailBgColor },
            ]}
          >
            {saleData.payment_type}
          </Text>
        </View>
      </View>

      <Text style={[styles.itemTotal, { color: textColor, flexShrink: 0 }]}>
        {formatNumber(saleData.total_amount)}원
      </Text>
    </TouchableOpacity>
  );
};

export default SaleItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    minHeight: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 20,
    ...commonStyles.dropShadow,
  },
  contentContainer: {
    gap: 4,
  },
  customerInfo: { gap: 8 },
  customerTitle: { flex: 1, flexShrink: 1, gap: 4, alignSelf: "flex-start" },
  customerName: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
    letterSpacing: -1,
  },
  numOfVisit: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(8),
    letterSpacing: -0.5,
  },
  detailToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  itemTotal: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
    letterSpacing: -1,
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    gap: 4,
  },
  detailText: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(8),
    color: colors.purple,
    textAlign: "center",
  },
  saleInfoButton: {
    paddingLeft: 8,
  },
});
