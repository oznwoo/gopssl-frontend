import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DailySalesScreen from "../screens/DailySalesScreen";
import SearchScreen from "../screens/SearchScreen";
import SalesComparisionScreen from "../screens/SalesComparisionScreen";
import SettingScreen from "../screens/SettingScreen";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === "DailySales") iconName = "home-outline";
        else if (route.name === "Search") iconName = "search-outline";
        else if (route.name === "Comparision") iconName = "bar-chart-outline";
        else if (route.name === "Setting") iconName = "settings-outline";

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007aff",
      tabBarInactiveTintColor: "gray",
      headerShown: false, // 각 탭에서 헤더 숨김
    })}
  >
    <Tab.Screen name="DailySales" component={DailySalesScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Comparision" component={SalesComparisionScreen} />
    <Tab.Screen name="Setting" component={SettingScreen} />
  </Tab.Navigator>
);

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return <StackNavigator />;
};

export default MainNavigator;
