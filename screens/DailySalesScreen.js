import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";

const DailySalesScreen = (props) => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.horizontalHeader}>
          <TouchableOpacity
            style={{ ...styles.arrowButton, ...styles.horizontalArrowButton }}
          >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>2025년 7월 15일</Text>
          </View>
          <TouchableOpacity
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
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>총 매출: 0원</Text>
      </View>
    </View>
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
  horizontalLine: {
    position: "relative",
    top: 24,
    height: 2,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 1,
    alignSelf: "center",
    ...commonStyles.dropShadow,
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
