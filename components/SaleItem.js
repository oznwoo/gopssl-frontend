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

const SaleItem = ({ saleData }) => {
  console.log(saleData);

  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const treatmentText = saleData.treatments
    .map((item) => `${item.treatment_name}: ${item.price}원`)
    .join(", ");

  const toggleExpand = () => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1, // 0: 오른쪽 ▶️, 1: 아래 🔽
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "180deg"], // ▶️ → 🔽
  });

  return (
    <View style={styles.itemContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.customerInfoContainer}>
          <Text style={styles.customerName}>
            <Text style={{ fontFamily: "gamtanDotumB" }}>
              {saleData.customer_name}
            </Text>
            {` 고객님`}
          </Text>
          <Text style={styles.numOfVisit}>{saleData.num_of_visits}회 방문</Text>
        </View>
        <TouchableOpacity onPress={toggleExpand} style={styles.detailToggle}>
          <Text style={styles.detailTitle}>상세 정보</Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="triangle" size={12} color={colors.purple} />
          </Animated.View>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>{treatmentText}</Text>
            <Text style={styles.detailText}>이전 방문일: {}</Text>
            <Text style={styles.detailText}>최초 방문일: {}</Text>
            <Text style={styles.detailText}>
              결제 방식: {saleData.payment_type}
            </Text>
          </View>
        )}
        <Text style={styles.detailTitle}>매출: {saleData.total_amount}원</Text>
      </View>
      <TouchableOpacity style={styles.saleInfoButton}>
        <FontAwesome5 name="chevron-right" size={24} color={colors.purple} />
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

    borderWidth: 1,
    borderColor: colors.lightPurple,
    borderRadius: 12,
    padding: 16,

    ...commonStyles.dropShadow,
    backgroundColor: "#fff",
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
    color: colors.purple,
  },
  numOfVisit: {
    fontFamily: "nanumSquareR",
    fontSize: 8,
    letterSpacing: "-0.5",
    color: colors.purple,
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
    color: colors.purple,
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
});
