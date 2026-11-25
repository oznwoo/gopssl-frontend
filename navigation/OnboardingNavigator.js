import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import AddressSearchScreen from "../screens/AddressSearchScreen";

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
  </Stack.Navigator>
);

export default OnboardingNavigator;
