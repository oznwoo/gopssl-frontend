import React from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import FormHeader from "../components/FormHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import InfoForm from "../components/InfoForm";
import SignUpForm from "../components/SignUpForm";
import { useSelector } from "react-redux";
import UserForm from "../components/UserForm";
import colors from "../styles/color";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.auth.user);
  const route = useRoute();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.pageContainer}>
      <FormHeader title="계정" onGoBack={handleGoBack} />
      <UserForm />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
});
