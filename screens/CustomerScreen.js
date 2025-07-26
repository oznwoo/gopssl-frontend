import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../styles/color";
import FormHeader from "../components/FormHeader";
import CustomerForm from "../components/CustomerForm";

const CustomerScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.pageContainer}>
      <FormHeader title="고객 등록" onGoBack={handleGoBack} />

      <View style={styles.contentContainer}>
        <CustomerForm />
      </View>
    </View>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentContainer: { flex: 1 },
});
