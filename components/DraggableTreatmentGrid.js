import React, { useState, useEffect } from "react";
import DraggableGrid from "react-native-draggable-grid"; // 라이브러리 이름이 달라서 수정했습니다.
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../styles/color";
import { formatNumber } from "../utils/format";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const DraggableTreatmentGrid = React.memo(
  ({
    treatments,
    onDragEnd,
    onAddPress,
    onTreatmentPress,
    activeDragTarget, // 현재 드래그 중인 대상 ('list', 'grid', or null)
    setIsDragging,
  }) => {
    const [data, setData] = useState(treatments);

    useEffect(() => {
      setData(treatments);
    }, [treatments]);

    const renderItem = (item, index) => {
      if (item.isAddButton) {
        return (
          <View // '추가' 버튼은 드래그되지 않으므로 onLongPress를 제거합니다.
          >
            <TouchableOpacity
              style={[styles.treatmentItem, styles.addButton]}
              onPress={onAddPress}
            >
              <Text style={{ fontSize: 24, color: colors.purple }}>+</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View
          style={styles.treatmentItem}
          // DraggableGrid가 자체적으로 드래그 제스처를 처리하므로 onLongPress를 제거합니다.
        >
          <TouchableOpacity onPress={() => onTreatmentPress(item)}>
            <Text style={styles.treatmentName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.treatmentPrice}>
              {formatNumber(item.default_price)}원
            </Text>
          </TouchableOpacity>
        </View>
      );
    };

    // 카테고리 목록(list)이 드래그 중일 때는 Grid를 드래그 불가능한 일반 View로 렌더링합니다.
    if (activeDragTarget !== "grid") {
      return (
        <View style={styles.gridContainer}>
          <View style={styles.gridInnerContainer}>
            {data.map((item, index) => (
              <View
                key={item.id || `add-btn-${index}`}
                style={styles.gridItemWrapper}
              >
                {renderItem(item, index)}
              </View>
            ))}
          </View>
        </View>
      );
    }

    // 그 외의 경우 (아무것도 드래그하지 않거나, grid를 드래그할 때) DraggableGrid를 렌더링합니다.
    return (
      <DraggableGrid
        style={styles.gridContainer}
        data={data}
        numColumns={4}
        renderItem={renderItem}
        onDragStart={() => {
          setIsDragging(true);
        }}
        onDragRelease={(reorderedData) => {
          setData(reorderedData);
          onDragEnd(reorderedData);
          setIsDragging(false);
        }}
      />
    );
  }
);

export default DraggableTreatmentGrid;

const styles = StyleSheet.create({
  gridContainer: {},
  gridInnerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItemWrapper: {
    width: "25%", // numColumns가 4이므로 100% / 4 = 25%
    height: normalizeSize(96), // DraggableGrid의 itemHeight와 유사한 값으로 설정
  },
  treatmentItem: {
    flex: 1,
    minWidth: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00000033",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  addButton: {
    minHeight: normalizeSize(96),
    borderStyle: "dashed",
  },
  treatmentName: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(9),
    textAlign: "center",
    letterSpacing: -0.5,
  },
  treatmentPrice: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(9),
    textAlign: "center",
    letterSpacing: -0.5,
  },
});
