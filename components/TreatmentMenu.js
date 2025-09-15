import React, { useState } from "react";
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
import TreatmentForm from "./TreatmentForm";

const TreatmentMenu = ({
  selectedTreatments = [],
  onSelect,
  onPriceChange,
  extraPrices = {},
  onExtraPriceChange,
  mode = "input", // 기본값: input 모드
  onAddTreatment, // 새 시술 추가 콜백
  onEdit,
  onDelete,
}) => {
  const { treatments } = useSelector((state) => state.treatment);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const emptyTreatment = { name: "", price: "", category: "" };

  const groupTreatmentsByCategory = (treatments) => {
    return treatments.reduce((acc, treatment) => {
      const category = treatment.category || "etc";
      if (!acc[category]) acc[category] = [];
      acc[category].push(treatment);
      return acc;
    }, {});
  };

  const grouped = groupTreatmentsByCategory(treatments);

  const handleSaveTreatment = (newTreatment) => {
    // 부모 콜백 호출
    onAddTreatment?.({
      name: newTreatment.name,
      default_price: Number(newTreatment.price),
      category: newTreatment.category,
    });
    setIsModalVisible(false); // Modal 닫기
  };

  return (
    <View style={styles.treatmentInputContainer}>
      {Object.keys(grouped).map((category, index, array) => (
        <View key={category} style={styles.categoryGroup}>
          <Text style={styles.categoryTitle}>{category}</Text>

          <View style={styles.treatmentGrid}>
            {grouped[category].map((treatment) => {
              const isSelected = selectedTreatments.some(
                (t) => t.treatment_id === treatment.id
              );

              return category !== "product" ? (
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
              ) : (
                <View key={treatment.id} style={styles.productOption}>
                  <Text style={styles.treatmentName}>가격</Text>
                  <TextInput
                    placeholder="가격 입력"
                    keyboardType="numeric"
                    style={styles.optionInput}
                    onChangeText={(text) => onPriceChange?.(treatment, text)}
                    value={
                      selectedTreatments
                        .find((t) => t.treatment_id === treatment.id)
                        ?.price?.toString() || ""
                    }
                  />
                </View>
              );
            })}

            {/* 관리 모드에서 + 버튼 */}
            {mode === "manage" && (
              <TouchableOpacity
                style={[styles.treatmentItem, { justifyContent: "center" }]}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={{ fontSize: 24 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {category !== "product" && (
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
          )}

          {(mode === "manage" || index !== array.length - 1) && (
            <View style={styles.horizonalLine} />
          )}
        </View>
      ))}

      {/* Modal */}
      {mode === "manage" && (
        <TreatmentForm
          mode={mode}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveTreatment}
          initialData={emptyTreatment}
        />
      )}
    </View>
  );
};

export default TreatmentMenu;

const styles = StyleSheet.create({
  treatmentInputContainer: {
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  treatmentItem: {
    flex: 1,
    minWidth: "23%",
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#000",
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
    backgroundColor: "#000",
    height: 1,
    marginTop: 4,
    marginBottom: 12,
  },
  productOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  plusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  optionInput: {
    flex: 1,
    minHeight: 36,
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(10),
  },
});
