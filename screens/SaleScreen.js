import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../styles/color";
import FormHeader from "../components/FormHeader";
import SaleForm from "../components/SaleForm";

const SaleScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.pageContainer}>
      <FormHeader title="매출 등록" onGoBack={handleGoBack} />

      <View style={styles.contentContainer}>
        <SaleForm />
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
