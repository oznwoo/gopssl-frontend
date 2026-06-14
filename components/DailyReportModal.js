import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const DailyReportModal = ({ reportData, onClose }) => {
  if (!reportData) return null;

  return (
    <Modal visible={!!reportData} transparent animationType="slide">
      <View style={styles.overlay}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerDate}>
            {new Date(reportData.date).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </Text>
          <Text style={styles.headerTitle}>어제의 리포트</Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>총 매출</Text>
            <Text style={styles.summaryValue}>
              {reportData.totalAmount.toLocaleString()}원
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>방문 고객</Text>
            <Text style={styles.summaryValue}>{reportData.visitCount}명</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>결제 현황</Text>
            <Text style={styles.summaryValue}>
              현금 {reportData.cashCount}건 · 카드 {reportData.cardCount}건
            </Text>
          </View>
        </View>

        {reportData.deletedCustomers.length > 0 && (
          <View style={styles.deletedBox}>
            <Text style={styles.deletedTitle}>
              정리된 고객 {reportData.deletedCustomers.length}명
            </Text>
            <Text style={styles.deletedSubtitle}>
              6개월 이상 방문 이력이 없는 신규 고객님
            </Text>
            <ScrollView style={styles.deletedList} nestedScrollEnabled>
              {reportData.deletedCustomers.map((c) => (
                <Text key={c.id} style={styles.deletedItem}>
                  · {new Date(c.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  {c.detail ? `  ·  ${c.detail}` : ""}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>

      </View>
      </View>
    </Modal>
  );
};

export default DailyReportModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    backgroundColor: colors.backgroundPurple,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    maxHeight: "80%",
  },
  header: { gap: 4 },
  headerDate: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontFamily: "gamtanDotumB",
    fontSize: normalizeFont(22),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  summaryLabel: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(14),
    color: colors.lightPurple,
    letterSpacing: -0.5,
  },
  summaryValue: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(16),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundPurple,
  },
  deletedBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  deletedTitle: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(13),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  deletedSubtitle: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(11),
    color: colors.lightPurple,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  deletedList: { maxHeight: 80 },
  deletedItem: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(16),
    color: "#fff",
    letterSpacing: -0.5,
  },
});
