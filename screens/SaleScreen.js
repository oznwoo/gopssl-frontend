import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FormHeader from "../components/FormHeader";
import SaleForm from "../components/SaleForm";

const SaleScreen = ({ route }) => {
  const navigation = useNavigation();
  const saleDateString = route.params?.saleDate;
  const saleDate = saleDateString ? new Date(saleDateString) : null;

  const isViewMode = route.params?.itemId;
  console.log(isViewMode);

  const headerTitle = isViewMode ? "매출 정보" : "매출 등록";

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.pageContainer}>
      <FormHeader title={headerTitle} onGoBack={handleGoBack} />

      <View style={styles.contentContainer}>
        <SaleForm saleDate={saleDate} />
      </View>
    </View>
  );
};

export default SaleScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
