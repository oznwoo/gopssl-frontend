import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Platform } from "react-native";

import DailySalesScreen from "../screens/DailySalesScreen";
import SearchScreen from "../screens/SearchScreen";
import SalesComparisionScreen from "../screens/SalesComparisionScreen";
import SettingScreen from "../screens/SettingScreen";
import CustomerScreen from "../screens/CustomerScreen";
import SaleScreen from "../screens/SaleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddressSearchScreen from "../screens/AddressSearchScreen";
import DetailScreen from "../screens/DetailScreen";

import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../styles/color";
import { normalizeSize } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.lightPurple,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: normalizeSize(56 + insets.bottom),
          borderTopColor: colors.backgroundPurple,
          borderTopWidth: Platform.OS === "android" ? 0.5 : 1,
        },
        tabBarItemStyle: {
          marginHorizontal: Platform.OS === "android" ? 2 : 0,
          marginVertical: Platform.OS === "android" ? 2 : 0,
        },
        headerShown: false,
        // ✅ 전체 부모 영역을 터치 가능하게
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            style={[
              props.style,
              { paddingHorizontal: 12, paddingVertical: 16 },
            ]}
            activeOpacity={0.7}
          >
            {props.children}
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let IconComponent = null;
          let iconName = "";

          if (route.name === "DailySales") {
            IconComponent = MaterialIcons;
            iconName = "home-filled";
          } else if (route.name === "Search") {
            IconComponent = Ionicons;
            iconName = "person-circle";
          } else if (route.name === "Comparision") {
            IconComponent = FontAwesome6;
            iconName = "chart-simple";
          } else if (route.name === "Setting") {
            IconComponent = Ionicons;
            iconName = "settings";
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DailySales" component={DailySalesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Comparision" component={SalesComparisionScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

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
