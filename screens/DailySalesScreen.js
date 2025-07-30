import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import FloatingExpandButton from "../components/FloatingExpandedButton";

const DailySalesScreen = (props) => {
  const [date, setDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;

  const hideExpanded = () => {
    if (isExpanded) setIsExpanded(false);
  };

  const plusDate = () => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    setDate(nextDate);
  };

  const minusDate = () => {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    setDate(prevDate);
  };

  return (
    <TouchableWithoutFeedback onPress={hideExpanded}>
      <View style={styles.pageContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.horizontalHeader}>
            <TouchableOpacity
              onPress={minusDate}
              style={{ ...styles.arrowButton, ...styles.horizontalArrowButton }}
            >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <TouchableOpacity
              onPress={plusDate}
              style={{ ...styles.arrowButton, ...styles.horizontalArrowButton }}
            >
              <FontAwesome5 name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ ...styles.arrowButton, ...styles.verticalArrowButton }}
          >
            <FontAwesome5 name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>일일 매출</Text>
          <View style={styles.salesContainer}>
            <Text style={styles.emptyText}>매출이 등록되지 않았습니다.</Text>
          </View>

          <FloatingExpandButton style={styles.plusButton} date={date} />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>총 매출: 0원</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DailySalesScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    gap: 4,
  },
  horizontalHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  arrowButton: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    ...commonStyles.dropShadow,
  },
  horizontalArrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verticalArrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 12,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  dateText: {
    fontFamily: "gamtanDotumB",
    letterSpacing: "-0.5",
    fontSize: 20,
    color: colors.purple,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  contentTitle: {
    fontFamily: "gamtanDotumB",
    color: colors.purple,
    letterSpacing: "-0.5",
    fontSize: 24,
  },
  salesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "gamtanDotumB",
    fontSize: 16,
    letterSpacing: "-0.5",
    color: colors.lightPurple,
  },
  plusButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    ...commonStyles.dropShadow,
  },

  totalContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOffset: { width: 0, height: -1 },
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalText: {
    fontFamily: "gamtanBatangB",
    fontSize: 24,
    letterSpacing: "-0.5",
    color: colors.purple,
  },
});
