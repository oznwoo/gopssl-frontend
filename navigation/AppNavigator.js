import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import StartScreen from "../screens/StartScreen";

const AppNavigator = () => {
  const isAuth = false;

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && <StartScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
