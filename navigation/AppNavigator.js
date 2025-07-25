import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useSelector } from "react-redux";

const AppNavigator = () => {
  const isAuth = true;

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
