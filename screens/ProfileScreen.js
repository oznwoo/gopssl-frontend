import React from "react";
import { StyleSheet, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useNavigation } from "@react-navigation/native";
import UserForm from "../components/UserForm";
import colors from "../styles/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <FormHeader title="계정" onGoBack={handleGoBack} />
      <UserForm />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.purple,
  },
});
