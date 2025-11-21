import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DraggableFlatList from "react-native-draggable-flatlist";
import { normalizeFont } from "../utils/responsive";
import colors from "../styles/color";
import ModalWrapper from "./ModalWrapper";
import TreatmentForm from "./TreatmentForm";
import TreatmentCategoryForm from "./TreatmentCategoryForm";
import { commonStyles } from "../styles/commonStyles";
import {
  updateCategoriesOrder,
  updateTreatmentsOrder,
} from "../actions/treatmentActions";
import DraggableTreatmentGrid from "./DraggableTreatmentGrid";
import { TypeInput } from "./Input";

const TreatmentManageMenu = () => {
  const { treatments, categories } = useSelector((state) => state.treatment);
  const [menuData, setMenuData] = useState([]);
  const dispatch = useDispatch();

  // 'list', 'grid', null 중 하나의 값을 가지는 드래그 상태
  const [activeDragTarget, setActiveDragTarget] = useState(null);
  // 'list' -> '카테고리', 'grid' -> '시술'임을 번역해주는 객체
  const dragTargetText = {
    list: "카테고리",
    grid: "시술",
  };

  const [modalInfo, setModalInfo] = useState({
    type: null, // 'treatment', 'category', or null
    mode: "register", // 'register' or 'view'
    data: null,
  });

  useEffect(() => {
    const sortedCategories = [...categories].sort(
      (a, b) => a.display_order - b.display_order
    );
    const sortedTreatments = [...treatments];

    const getInitialGroupedData = () => {
      const treatmentsGrouped = sortedTreatments.reduce((acc, treatment) => {
        const categoryId = treatment.category_id;
        if (!acc[categoryId]) acc[categoryId] = [];
        acc[categoryId].push(treatment);
        return acc;
      }, {});

      return sortedCategories.map((category) => {
        const categoryTreatments = (treatmentsGrouped[category.id] || []).sort(
          (a, b) => a.display_order - b.display_order
        );

        // '추가' 버튼을 위한 placeholder 아이템 추가
        const treatmentsWithAddButton = [
          ...categoryTreatments,
          {
            id: `add-button-${category.id}`,
            key: `add-button-${category.id}`,
            isAddButton: true,
          },
        ];

        return {
          ...category,
          treatments: treatmentsWithAddButton.map((t) => ({
            ...t,
            key: t.isAddButton ? t.id : `treatment-${t.id}`,
          })),
          key: `category-${category.id}`,
        };
      });
    };
    setMenuData(getInitialGroupedData());
  }, [treatments, categories]);

  const handleCategoryPress = (categoryName) => {
    const categoryData = categories.find((c) => c.name === categoryName);
    if (categoryData) {
      setModalInfo({ type: "category", mode: "view", data: categoryData });
    }
  };

  const closeModal = () => setModalInfo({ type: null });

  // 카테고리 순서 변경 핸들러
  const handleCategoryDragEnd = ({ data }) => {
    const newMenuData = data.map((category, index) => {
      return { ...category, display_order: index };
    });
    setMenuData(newMenuData);
    dispatch(updateCategoriesOrder(newMenuData));
  };

  // 카테고리 내 시술 순서 변경 핸들러
  const handleTreatmentDragEnd = (categoryId, reorderedData) => {
    const treatmentsToUpdate = reorderedData.map((treatment, index) => {
      return { ...treatment, display_order: index };
    });

    const newMenuData = menuData.map((category) => {
      if (category.id === categoryId) {
        return { ...category, treatments: treatmentsToUpdate };
      }
      return category;
    });

    setMenuData(newMenuData);
    dispatch(updateTreatmentsOrder(treatmentsToUpdate));
  };

  // 카테고리 아이템 렌더링 (내부에 시술 리스트 포함)
  const renderCategoryItem = ({ item: category, drag, isActive }) => {
    // 카테고리 목록(list) 드래그 시에만 drag 함수를 전달합니다.
    const onLongPressDrag = activeDragTarget === "grid" ? undefined : drag;

    return (
      <View style={styles.categoryGroup}>
        <TouchableOpacity
          style={[
            styles.categoryBar,
            // DraggableFlatList의 isActive와 activeDragTarget 상태를 모두 고려하여 스타일 적용
            { backgroundColor: isActive ? colors.lightPurple : "#fff" },
          ]}
          onLongPress={onLongPressDrag}
          onPress={() => handleCategoryPress(category.name)}
        >
          <Text style={styles.categoryTitle}>{category.name}</Text>
        </TouchableOpacity>

        <DraggableTreatmentGrid
          treatments={category.treatments}
          onDragEnd={(reorderedData) =>
            handleTreatmentDragEnd(category.id, reorderedData)
          }
          onAddPress={() =>
            setModalInfo({
              type: "treatment",
              mode: "register",
              data: { category_id: category.id, category: category.name },
            })
          }
          onTreatmentPress={(treatment) =>
            setModalInfo({ type: "treatment", mode: "view", data: treatment })
          }
          // 제스처 충돌 방지를 위한 상태와 상태 변경 함수 전달
          activeDragTarget={activeDragTarget}
          setActiveDragTarget={setActiveDragTarget}
        />
      </View>
    );
  };

  // Grid가 드래그 중일 때는 카테고리 목록이 움직이지 않도록 일반 FlatList로 교체합니다.
  const ListComponent =
    activeDragTarget === "list" ? DraggableFlatList : FlatList;

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 4, right: -4 }}>
        <TypeInput
          options={["카테고리", "시술"]}
          onChange={(val) => {
            const foundKey = Object.keys(dragTargetText).find(
              (key) => dragTargetText[key] === val
            );
            setActiveDragTarget(foundKey);
          }}
          value={dragTargetText[activeDragTarget]}
          toggleButtonMode={true}
          useBlur={false}
        />
      </View>
      <ListComponent
        data={menuData}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        keyExtractor={(item) => item.key}
        renderItem={renderCategoryItem}
        // DraggableFlatList에만 필요한 props
        onDragBegin={() => {
          // 리스트 드래그 시작 시 상태를 'list'로 설정
          setActiveDragTarget("list");
        }}
        onDragEnd={
          ListComponent === DraggableFlatList
            ? handleCategoryDragEnd
            : undefined
        }
        ItemSeparatorComponent={() => <View style={styles.horizonalLine} />}
      />

      {/* Modal */}
      {modalInfo.type && (
        <ModalWrapper isVisible={!!modalInfo.type} onClose={closeModal}>
          {modalInfo.type === "treatment" && (
            <TreatmentForm
              // TreatmentForm이 category_id 대신 category 이름으로 받고 있어서,
              // 모달 열 때 category 이름을 전달하도록 수정했습니다.
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

export default TreatmentManageMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 4,
    ...commonStyles.lightDropShadow,
  },
  treatmentItem: {
    // 4열 그리드를 위해 너비를 고정하고, margin 대신 space-between으로 간격 조절
    width: "23%",
    aspectRatio: 1.5, // 아이템을 정사각형에 가깝게 (비율 조정 가능)
    borderWidth: 1,
    // 아이템 하단에만 간격을 주어 줄바꿈 시에도 일정한 간격을 유지
    marginBottom: "2%",
    borderColor: "#00000033",
    borderRadius: 8,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dragHandle: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  addButton: {
    width: "23%", // 다른 아이템과 동일한 너비
    justifyContent: "center",
    alignItems: "center",
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
  horizonalLine: {
    backgroundColor: "#0000001A",
    height: 2,
    marginVertical: 8,
  },
});
