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
import ModalWrapper from "./ModalWrapper";
import TreatmentForm from "./TreatmentForm";
import TreatmentCategoryForm from "./TreatmentCategoryForm";
import { commonStyles } from "../styles/commonStyles";
import Entypo from "@expo/vector-icons/Entypo";

const TreatmentMenu = ({
  selectedTreatments = [],
  onSelect,
  extraPrices = {},
  onExtraPriceChange,
  mode = "input", // 기본값: input 모드
}) => {
  const { treatments, categories } = useSelector((state) => state.treatment);

  const [modalInfo, setModalInfo] = useState({
    type: null, // 'treatment', 'category', or null
    mode: "register", // 'register' or 'view'
    data: null,
  });

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

  const grouped = getGroupedData(treatments, categories, mode);

  const handleCategoryPress = (categoryName) => {
    if (mode !== "manage") return;
    const categoryData = categories.find((c) => c.name === categoryName);
    if (categoryData) {
      setModalInfo({ type: "category", mode: "view", data: categoryData });
    }
  };

  const closeModal = () => setModalInfo({ type: null });

  return (
    <View style={styles.treatmentInputContainer}>
      {Object.keys(grouped).map((category, index, array) => (
        <View key={category} style={styles.categoryGroup}>
          <TouchableOpacity
            style={[
              mode === "manage" && styles.categoryBar,
              { marginBottom: 8 },
            ]}
            onPress={() => handleCategoryPress(category)}
            disabled={mode !== "manage"}
          >
            <Text style={styles.categoryTitle}>{category}</Text>
            {mode === "manage" && (
              <TouchableOpacity style={{ padding: 2 }}>
                <Entypo name="menu" size={16} color={"#000"} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

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
                  onPress={
                    mode === "manage"
                      ? () => {
                          setModalInfo({
                            type: "treatment",
                            mode: "view",
                            data: treatment,
                          });
                        }
                      : () => onSelect?.(treatment)
                  }
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

            {/* 관리 모드에서 + 버튼 */}
            {mode === "manage" && (
              <TouchableOpacity
                style={[styles.treatmentItem, { justifyContent: "center" }]}
                onPress={() => {
                  setModalInfo({
                    type: "treatment",
                    mode: "register",
                    data: {
                      name: "",
                      category_name: category,
                    },
                  });
                }}
              >
                <Text style={{ fontSize: 24 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.plusOption}>
            <Text style={styles.treatmentName}>기장추가</Text>
            <TextInput
              placeholder="가격 입력"
              keyboardType="numeric"
              style={styles.optionInput}
              onChangeText={(text) => onExtraPriceChange?.(category, text)}
              value={extraPrices[category]?.toString() || ""}
              readOnly={mode === "manage"}
            />
          </View>

          {index !== array.length - 1 && <View style={styles.horizonalLine} />}
        </View>
      ))}

      {/* Modal */}
      {mode === "manage" && modalInfo.type && (
        <ModalWrapper isVisible={!!modalInfo.type} onClose={closeModal}>
          {modalInfo.type === "treatment" && (
            <TreatmentForm
              mode={modalInfo.mode}
              data={modalInfo.data}
              onClose={closeModal}
            />
          )}
          {modalInfo.type === "category" && (
            <TreatmentCategoryForm
              mode={modalInfo.mode}
              data={modalInfo.data}
              onClose={closeModal}
            />
          )}
        </ModalWrapper>
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
  },
  categoryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,

    ...commonStyles.lightDropShadow,
  },
  categoryEditText: {
    fontSize: normalizeFont(12),
    fontFamily: "nanumSquareB",
    letterSpacing: -0.5,
    color: colors.opacityPurple,
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
    backgroundColor: "#00000033",
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
    borderColor: "#00000033",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    width: "80%",
  },
});
