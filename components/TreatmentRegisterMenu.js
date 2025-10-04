import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { formatNumber } from "../utils/format";
import { normalizeFont } from "../utils/responsive";
import colors from "../styles/color";
import { useSelector } from "react-redux";

const TreatmentRegisterMenu = ({
  selectedTreatments = [],
  onSelect,
  extraPrices = {},
  onExtraPriceChange,
}) => {
  const { treatments, categories } = useSelector((state) => state.treatment);

  const getGroupedData = (treatments, categories, mode) => {
    // 1. 카테고리 ID를 이름으로 매핑하는 맵 생성 (효율적 조회를 위해)
    const categoryIdToNameMap = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});

    // 2. 시술 목록을 카테고리 이름으로 그룹화 (시술이 있는 카테고리만 포함됨)
    const treatmentsGrouped = treatments.reduce((acc, treatment) => {
      const categoryName = categoryIdToNameMap[treatment.category_id] || "etc";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(treatment);
      return acc;
    }, {});

    if (mode === "manage") {
      // 3. "manage" 모드: 모든 카테고리를 기준으로 데이터 재구성
      const allCategoriesGrouped = categories.reduce((acc, category) => {
        // 시술이 있으면 해당 목록을, 없으면 빈 배열을 할당
        acc[category.name] = treatmentsGrouped[category.name] || [];
        return acc;
      }, {});
      return allCategoriesGrouped;
    } else {
      // 4. "input" 모드: 기존과 동일하게 시술이 있는 카테고리만 반환
      return treatmentsGrouped;
    }
  };

  const grouped = getGroupedData(treatments, categories, "input");

  return (
    <View style={styles.treatmentInputContainer}>
      {Object.keys(grouped).map((category, index, array) => (
        <View key={category}>
          <View style={styles.categoryGroup}>
            <Text style={styles.categoryTitle}>{category}</Text>

            <View style={styles.treatmentGrid}>
              {grouped[category].map((treatment) => {
                const isSelected = selectedTreatments.some(
                  (t) => t.treatment_id === treatment.id
                );
                return (
                  <TouchableOpacity
                    key={treatment.id}
                    style={[
                      styles.treatmentItem,
                      isSelected && styles.treatmentItemSelected,
                    ]}
                    onPress={() => onSelect?.(treatment)}
                  >
                    <Text
                      style={[
                        styles.treatmentName,
                        isSelected && styles.treatmentTextSelected,
                      ]}
                    >
                      {treatment.name}
                    </Text>
                    <Text
                      style={[
                        styles.treatmentPrice,
                        isSelected && styles.treatmentTextSelected,
                      ]}
                    >
                      {formatNumber(treatment.default_price)}원
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.plusOption}>
              <Text style={styles.treatmentName}>기장추가</Text>
              <TextInput
                placeholder="가격 입력"
                keyboardType="numeric"
                style={styles.optionInput}
                onChangeText={(text) => onExtraPriceChange?.(category, text)}
                value={extraPrices[category]?.toString() || ""}
              />
            </View>
          </View>
          {index !== array.length - 1 && <View style={styles.horizonalLine} />}
        </View>
      ))}
    </View>
  );
};

export default TreatmentRegisterMenu;

const styles = StyleSheet.create({
  treatmentInputContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
    backgroundColor: colors.backgroundPurple,
  },
  categoryGroup: {
    width: "100%",
    gap: 4,
  },
  categoryTitle: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  treatmentGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  treatmentItem: {
    flex: 1,
    minWidth: "23%",
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 8,
    paddingHorizontal: 4,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  treatmentItemSelected: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  treatmentTextSelected: {
    color: "#fff",
  },
  treatmentName: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(9),
    letterSpacing: -0.5,
  },
  treatmentPrice: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(8),
    letterSpacing: -0.5,
  },
  horizonalLine: {
    backgroundColor: "#0000001A",
    height: 1,
    marginVertical: 8,
  },
  plusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  optionInput: {
    flex: 1,
    minHeight: 36,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
  },
});
