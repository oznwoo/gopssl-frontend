import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DailySalesScreen from "../screens/DailySalesScreen";
import SearchScreen from "../screens/SearchScreen";
import SalesComparisionScreen from "../screens/SalesComparisionScreen";
import SettingScreen from "../screens/SettingScreen";

import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../styles/color";
import { StyleSheet } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import CustomerScreen from "../screens/CustomerScreen";
import SaleScreen from "../screens/SaleScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconData = {
          iconFamily: null,
          iconName: null,
        };

        if (route.name === "DailySales") {
          iconData.iconFamily = FontAwesome6;
          iconData.iconName = "calendar";
        } else if (route.name === "Search") {
          iconData.iconFamily = FontAwesome5;
          iconData.iconName = "search";
        } else if (route.name === "Comparision") {
          iconData.iconFamily = FontAwesome6;
          iconData.iconName = "chart-simple";
        } else if (route.name === "Setting") {
          iconData.iconFamily = Ionicons;
          iconData.iconName = "settings";
        }

        return (
          <iconData.iconFamily
            name={iconData.iconName}
            size={size}
            color={color}
          />
        );
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: colors.lightPurple,
      tabBarInactiveBackgroundColor: "#fff",
      tabBarStyle: styles.tabBar,
      tabBarItemStyle: styles.tabBarItem,
      tabBarIconStyle: styles.tabBarIcon,

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
    <Stack.Screen
      name="Customer"
      component={CustomerScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Sale"
      component={SaleScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return <StackNavigator />;
};

export default MainNavigator;

const styles = StyleSheet.create({
  tabBar: { flex: 1, maxHeight: 64 },

  tabBarItem: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.purple,
  },
  tabBarIcon: {
    marginVertical: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});
