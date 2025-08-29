import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";

const DetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title="상세정보" onGoBack={handleGoBack} />
      <View style={styles.contentContainer}>
        <Text style={styles.text}>version: 1.0.0</Text>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.purple,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    letterSpacing: -0.5,
  },
});
