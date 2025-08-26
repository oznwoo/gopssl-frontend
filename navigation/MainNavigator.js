import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DailySalesScreen from "../screens/DailySalesScreen";
import SearchScreen from "../screens/SearchScreen";
import SalesComparisionScreen from "../screens/SalesComparisionScreen";
import SettingScreen from "../screens/SettingScreen";

import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../styles/color";
import { Platform, StyleSheet } from "react-native";
import CustomerScreen from "../screens/CustomerScreen";
import SaleScreen from "../screens/SaleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddressSearchScreen from "../screens/AddressSearchScreen";
import DetailScreen from "../screens/DetailScreen";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        // 아이콘 로직 유지
        const iconData = {
          iconFamily: null,
          iconName: null,
        };

        if (route.name === "DailySales") {
          iconData.iconFamily = MaterialIcons;
          iconData.iconName = "home-filled";
        } else if (route.name === "Search") {
          iconData.iconFamily = FontAwesome;
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
      // 라벨 스타일
      tabBarLabelStyle: {
        fontSize: normalizeFont(10),
        fontFamily: "nanumSquareB",
        textTransform: "none", // 대문자 변환 방지
        marginTop: 0,
      },
      tabBarActiveTintColor: colors.purple,
      tabBarInactiveTintColor: colors.lightPurple,

      // 개선된 스타일링
      tabBarStyle: {
        backgroundColor: "#fff", // 전체 탭바 배경
        height: normalizeSize(56),
        paddingHorizontal: 4, // 좌우 패딩
        paddingVertical: 4, // 상하 패딩
        borderTopWidth: 0,
        shadowOpacity: 0,
        borderTopColor: colors.backgroundPurple,
        borderTopWidth: Platform.OS === "android" ? 0.5 : 1,
      },

      tabBarItemStyle: {
        borderRadius: 16,
        marginHorizontal: Platform.OS === "android" ? 2 : 0,
        marginVertical: Platform.OS === "android" ? 2 : 0,
      },

      headerShown: false,
    })}
  >
    <Tab.Screen
      name="DailySales"
      component={DailySalesScreen}
      options={{ tabBarLabel: "홈" }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{ tabBarLabel: "검색" }}
    />
    <Tab.Screen
      name="Comparision"
      component={SalesComparisionScreen}
      options={{ tabBarLabel: "통계" }}
    />
    <Tab.Screen
      name="Setting"
      component={SettingScreen}
      options={{ tabBarLabel: "설정" }}
    />
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
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddressSearch"
      component={AddressSearchScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return <StackNavigator />;
};

export default MainNavigator;

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    maxHeight: normalizeSize(56),
  },
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
