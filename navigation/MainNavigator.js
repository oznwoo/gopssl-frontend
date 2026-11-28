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
import TreatmentSettingScreen from "../screens/TreatmentSettingScreen";
import DeletedCustomersScreen from "../screens/DeletedCustomersScreen";
import ChangeEmailScreen from "../screens/ChangeEmailScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../styles/color";
import { normalizeSize } from "../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTourTarget } from "../components/HomeTour";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 전체 부모 영역을 터치 가능하게 한 탭 버튼. 홈 기능 안내에서 강조할 수 있게 ref를 등록한다
const TabButton = ({ routeName, style, children, ...props }) => {
  const tourRef = useTourTarget(`tab-${routeName}`);
  return (
    <TouchableOpacity
      {...props}
      ref={tourRef}
      style={[style, { paddingHorizontal: 12, paddingVertical: 16 }]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

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
          // 시스템 영역(insets.bottom)은 실제 크기라 화면 배율을 곱하면 안 된다.
          // 탭 바는 paddingBottom으로 insets.bottom을 그대로 쓰므로, 배율을 곱하면
          // 좁은 화면(갤럭시 등)에서 아이콘 영역만 줄어든다. 3버튼 내비게이션은 inset이 커서 더 티가 난다.
          height: normalizeSize(56) + insets.bottom,
          borderTopColor: colors.backgroundPurple,
          borderTopWidth: Platform.OS === "android" ? 0.5 : 1,
        },
        tabBarItemStyle: {
          marginHorizontal: Platform.OS === "android" ? 2 : 0,
          marginVertical: Platform.OS === "android" ? 2 : 0,
        },
        headerShown: false,
        tabBarButton: (props) => (
          <TabButton {...props} routeName={route.name} />
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
      name="Treatment"
      component={TreatmentSettingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddressSearch"
      component={AddressSearchScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="DeletedCustomers"
      component={DeletedCustomersScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ChangeEmail"
      component={ChangeEmailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return <StackNavigator />;
};

export default MainNavigator;
