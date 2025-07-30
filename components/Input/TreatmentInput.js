import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BaseInput from "./BaseInput";
import colors from "../../styles/color";

import { useDispatch, useSelector } from "react-redux";
import { fetchTreatmentsThunk } from "../../actions/treatmentActions";

const CATEGORY_KR_MAP = {
  cut: "커트",
  perm: "펌",
  color: "염색",
  elderly: "경로",
};

const groupTreatmentsByCategory = (treatments) => {
  return treatments.reduce((acc, treatment) => {
    const originalCategory = treatment.category || "etc";
    const category = CATEGORY_KR_MAP[originalCategory] || "기타";
    if (!acc[category]) acc[category] = [];
    acc[category].push(treatment);
    return acc;
  }, {});
};

const TreatmentInput = ({ onTreatmentDataChange, ...rest }) => {
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.treatment);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [extraPrices, setExtraPrices] = useState({});
  const prevPayloadRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTreatmentsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!onTreatmentDataChange) return;

    const result = selectedTreatments
      .filter((t) => t?.id && t?.default_price)
      .map((t) => {
        const category = CATEGORY_KR_MAP[t.category] || "기타";
        return {
          treatment_id: t.id,
          price: t.default_price,
        };
      });

    const payload = {
      treatments: result,
      extraPrices,
    };

    const prev = JSON.stringify(prevPayloadRef.current);
    const curr = JSON.stringify(payload);

    if (prev !== curr) {
      onTreatmentDataChange(payload);
      prevPayloadRef.current = payload;
    }
  }, [selectedTreatments, extraPrices, onTreatmentDataChange]);

  const toggleTreatment = (treatment) => {
    if (!treatment?.id) return;
    setSelectedTreatments((prev) => {
      const exists = prev.some((t) => t.id === treatment.id);
      return exists
        ? prev.filter((t) => t.id !== treatment.id)
        : [...prev, { ...treatment }];
    });
  };

  const handleExtraPriceChange = (category, text) => {
    const price = parseInt(text, 10) || 0;
    setExtraPrices((prev) => ({
      ...prev,
      [category]: price,
    }));
  };

  const grouped = groupTreatmentsByCategory(treatments);

  return (
    <BaseInput {...rest} portraitMode={true}>
      <View style={styles.treatmentInputContainer}>
        <TextInput style={styles.textInput} value={""} editable={false} />

        {Object.keys(grouped).map((category, index, array) => (
          <View key={category} style={styles.categoryGroup}>
            <Text style={styles.categoryTitle}>{category}</Text>

            <View style={styles.treatmentGrid}>
              {grouped[category].map((treatment) => {
                const isSelected = selectedTreatments.some(
                  (t) => t.id === treatment.id
                );
                return (
                  <TouchableOpacity
                    key={treatment.id}
                    style={[
                      styles.treatmentItem,
                      isSelected && styles.treatmentItemSelected,
                    ]}
                    onPress={() => toggleTreatment(treatment)}
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
                      {treatment.default_price}원
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[styles.treatmentItem, styles.plusOption]}>
              <Text style={styles.treatmentName}>기장추가</Text>
              <TextInput
                placeholder="가격 입력"
                keyboardType="numeric"
                style={styles.optionInput}
                onChangeText={(text) => handleExtraPriceChange(category, text)}
                value={extraPrices[category]?.toString() || ""}
              />
            </View>

            {index !== array.length - 1 && (
              <View style={styles.horizonalLine} />
            )}
          </View>
        ))}
      </View>
    </BaseInput>
  );
};

export default TreatmentInput;

const styles = StyleSheet.create({
  treatmentInputContainer: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.backgroundPurple,
  },
  textInput: {
    fontFamily: "nanumSquareR",
    fontSize: 12,
  },
  categoryGroup: {
    width: "100%",
    gap: 4,
  },
  categoryTitle: {
    fontFamily: "nanumSquareB",
    fontSize: 16,
    letterSpacing: "-0.5",
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
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
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
    fontFamily: "gamtanDotumB",
    fontSize: 10,
    letterSpacing: -0.5,
  },
  treatmentPrice: {
    fontFamily: "nanumSquareB",
    fontSize: 8,
    letterSpacing: -0.5,
  },
  horizonalLine: {
    backgroundColor: "#000",
    height: 1,
    marginTop: 4,
    marginBottom: 12,
  },
  plusOption: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
  },
  optionInput: {
    flex: 1,
    fontFamily: "nanumSqaureB",
    letterSpacing: "-0.5",
    fontSize: 8,
  },
});
