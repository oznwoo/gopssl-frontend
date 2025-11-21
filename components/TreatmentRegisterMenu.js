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

  const getGroupedData = (treatments, categories) => {
    // 1. display_order에 따라 카테고리 정렬
    const sortedCategories = [...categories].sort(
      (a, b) => a.display_order - b.display_order
    );

    // 2. 시술 목록을 카테고리 ID로 그룹화
    const treatmentsGrouped = treatments.reduce((acc, treatment) => {
      const categoryId = treatment.category_id;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(treatment);
      return acc;
    }, {});

    // 3. 정렬된 카테고리 배열과 그룹화된 시술 객체를 함께 반환
    return { sortedCategories, treatmentsGrouped };
  };

  const { sortedCategories, treatmentsGrouped } = getGroupedData(
    treatments,
    categories
  );

  return (
    <View style={styles.treatmentInputContainer}>
      {sortedCategories.map((category, index, array) => {
        const categoryTreatments = treatmentsGrouped[category.id] || [];
        if (categoryTreatments.length === 0) return null; // 시술이 없는 카테고리는 렌더링하지 않음

        return (
          <View key={category.id}>
            <View style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category.name}</Text>

              <View style={styles.treatmentGrid}>
                {categoryTreatments.map((treatment) => {
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
                  onChangeText={(text) =>
                    onExtraPriceChange?.(category.name, text)
                  }
                  value={extraPrices[category.name]?.toString() || ""}
                />
              </View>
            </View>
            {index !== array.length - 1 && (
              <View style={styles.horizonalLine} />
            )}
          </View>
        );
      })}
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
