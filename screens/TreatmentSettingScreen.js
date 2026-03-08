import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../styles/color";
import TreatmentManageMenu from "../components/TreatmentManageMenu";
import { useDispatch } from "react-redux";
import { fetchTreatmentsThunk } from "../actions/treatmentActions";
import TreatmentCategoryForm from "../components/TreatmentCategoryForm";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModalWrapper from "../components/ModalWrapper";
import { normalizeFont } from "../utils/responsive";
import { useNavigation } from "@react-navigation/native";

const TreatmentSettingScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const handleAddCategory = () => setIsCategoryModalVisible(true);
  const handleGoBack = () => navigation.goBack();

  useEffect(() => {
    dispatch(fetchTreatmentsThunk());
  }, [dispatch, isCategoryModalVisible]);

  return (
    <GestureHandlerRootView
      style={[styles.pageContainer, { paddingTop: insets.top }]}
    >
      <FormHeader
        onGoBack={handleGoBack}
        title={"시술 관리"}
        onRightButtonPress={handleAddCategory}
        rightButton={<Text style={styles.categotyPlusText}>카테고리 추가</Text>}
      />
      <View style={styles.contentContainer}>
        <TreatmentManageMenu />
      </View>

      {/* 카테고리 추가 모달 */}
      <ModalWrapper
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        animationType={"slide"}
      >
        <TreatmentCategoryForm
          onClose={() => setIsCategoryModalVisible(false)}
        />
      </ModalWrapper>
    </GestureHandlerRootView>
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
    backgroundColor: colors.backgroundPurple,
  },
  categotyPlusText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.backgroundPurple,
    letterSpacing: -0.5,
  },
});
