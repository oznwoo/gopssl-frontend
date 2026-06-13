import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import AddressSearchScreen from "../screens/AddressSearchScreen";
import OnboardingScreen from "../screens/OnboardingScreen";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="InfoScreen"
  >
    <Stack.Screen
      name="InfoScreen"
      component={StartScreen}
      initialParams={{ formType: "info" }}
    />
    <Stack.Screen name="AddressSearchScreen" component={AddressSearchScreen} />
    <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
  </Stack.Navigator>
);

export default OnboardingNavigator;
