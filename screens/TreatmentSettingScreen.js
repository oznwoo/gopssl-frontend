import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../styles/color";
import TreatmentMenu from "../components/TreatmentMenu";
import { useDispatch } from "react-redux";
import { fetchTreatmentsThunk } from "../actions/treatmentActions";
import TreatmentCategoryForm from "../components/TreatmentCategoryForm";
import ModalWrapper from "../components/ModalWrapper";
import { normalizeFont } from "../utils/responsive";

const TreatmentSettingScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const handleAddCategory = () => setIsCategoryModalVisible(true);

  useEffect(() => {
    dispatch(fetchTreatmentsThunk());
  }, [dispatch, isCategoryModalVisible]);

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader
        title={"시술 관리"}
        onRightButtonPress={handleAddCategory}
        rightButton={<Text style={styles.categotyPlusText}>카테고리 추가</Text>}
      />
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.treatmentList}>
          <TreatmentMenu mode="manage" />
        </ScrollView>
      </View>

      {/* 카테고리 추가 모달 */}
      <ModalWrapper
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
      >
        <TreatmentCategoryForm
          onClose={() => setIsCategoryModalVisible(false)}
        />
      </ModalWrapper>
    </View>
  );
};

export default TreatmentSettingScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",

    backgroundColor: colors.backgroundPurple,
  },
  categotyPlusText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.backgroundPurple,
    letterSpacing: -0.5,
  },
  treatmentList: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
