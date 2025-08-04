import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { formatNumber } from "../utils/format";

const SaleItem = ({ saleData, transitionSale, transitionCustomer }) => {
  const isFirstVisit = saleData.num_of_visits === 1;
  const textColor = isFirstVisit ? "#fff" : colors.purple;
  const cardBgColor = isFirstVisit ? colors.purple : "#fff";
  const numOfVisitColor = isFirstVisit
    ? { color: "#76B4A0", fontFamily: "nanumSquareEB" }
    : { color: colors.purple, fontFamily: "nanumSquareR" };

  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const treatmentText = saleData.treatments
    .map((item) => `${item.treatment_name}: ${item.price}원`)
    .join(", ");

  const extraPriceText =
    Object.keys(saleData.extra_prices).length !== 0
      ? Object.keys(saleData.extra_prices)
          .map((key) => `기장추가(${key}): ${saleData.extra_prices[key]}원`)
          .join(", ")
      : "기장추가: 없음";

  const toggleExpand = () => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "180deg"],
  });

  return (
    <View style={[styles.itemContainer, { backgroundColor: cardBgColor }]}>
      <View style={styles.contentContainer}>
        <View style={styles.customerInfoContainer}>
          <TouchableOpacity
            onPress={() => transitionCustomer("view", saleData.customer_id)}
          >
            <Text style={[styles.customerName, { color: textColor }]}>
              <Text style={{ fontFamily: "gamtanDotumB" }}>
                {saleData.customer_name}
              </Text>
              {` 고객님`}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.numOfVisit, numOfVisitColor]}>
            {saleData.num_of_visits}회 방문
          </Text>
        </View>

        <TouchableOpacity onPress={toggleExpand} style={styles.detailToggle}>
          <Text style={[styles.detailTitle, { color: textColor }]}>
            상세 정보
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="triangle" size={12} color={textColor} />
          </Animated.View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>{treatmentText}</Text>
            <Text style={styles.detailText}>{extraPriceText}</Text>
            {saleData.previous_visit && (
              <Text style={styles.detailText}>
                {`이전 방문일: ${saleData.previous_visit}`}
              </Text>
            )}
            <Text style={styles.detailText}>
              최초 방문일: {saleData.first_visit}
            </Text>
            <Text style={styles.detailText}>
              결제 방식: {saleData.payment_type}
            </Text>
          </View>
        )}

        <Text style={[styles.detailTitle, { color: textColor }]}>
          매출: {formatNumber(saleData.total_amount)}원
        </Text>
      </View>

      <TouchableOpacity
        style={styles.saleInfoButton}
        onPress={() => transitionSale("view", saleData.id)}
      >
        <FontAwesome5 name="chevron-right" size={24} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

export default SaleItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    ...commonStyles.dropShadow,
  },
  contentContainer: {
    gap: 4,
  },
  customerInfoContainer: {},
  customerName: {
    fontFamily: "gamtanDotumR",
    fontSize: 20,
    letterSpacing: "-0.5",
    lineHeight: 26,
  },
  numOfVisit: {
    fontFamily: "nanumSquareR",
    fontSize: 8,
    letterSpacing: "-0.5",
  },
  detailToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  detailTitle: {
    fontFamily: "nanumSquareB",
    fontSize: 12,
    letterSpacing: "-0.5",
  },
  detailBox: {
    padding: 8,
    backgroundColor: colors.backgroundPurple,
    borderRadius: 8,
    gap: 4,
  },
  detailText: {
    fontFamily: "nanumSquareB",
    fontSize: 8,
    color: colors.purple,
  },
  saleInfoButton: {
    paddingLeft: 8,
  },
});
