import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../styles/color";
import TreatmentMenu from "../components/TreatmentMenu";
import { useDispatch } from "react-redux";
import { fetchTreatmentsThunk } from "../actions/treatmentActions";

const TreatmentSettingScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTreatmentsThunk());
  }, [dispatch]);

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title={"시술 관리"} />
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.treatmentList}>
          <TreatmentMenu mode="manage" />
        </ScrollView>
      </View>
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
  treatmentList: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
