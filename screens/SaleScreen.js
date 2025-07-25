import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../styles/color";
import FormHeader from "../components/FormHeader";

const SaleScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.pageContainer}>
      <FormHeader title="매출 등록" onGoBack={handleGoBack} />

      <View style={styles.contentContainer}></View>
    </View>
  );
};

export default SaleScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  contentContainer: {
    paddingHorizontal: 18,
  },
});
