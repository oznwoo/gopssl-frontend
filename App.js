import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";
import AppNavigator from "./navigation/AppNavigator";
import { enableScreens } from "react-native-screens";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false; // 접근성 글꼴 배율 무시
enableScreens();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          logo: require("./assets/fonts/BagelFatOne-Regular.ttf"),
          gamtanBatangB: require("./assets/fonts/GamtanRoad_Batang_Bold.ttf"),
          gamtanBatangR: require("./assets/fonts/GamtanRoad_Batang_Regular.ttf"),
          gamtanBatangT: require("./assets/fonts/GamtanRoad_Batang_Thin.ttf"),
          gamtanDotumB: require("./assets/fonts/GamtanRoad_Dotum_Bold.ttf"),
          gamtanDotumR: require("./assets/fonts/GamtanRoad_Dotum_Regular.ttf"),
          gamtanDotumT: require("./assets/fonts/GamtanRoad_Dotum_Thin.ttf"),
          nanumSquareL: require("./assets/fonts/NanumSquareL.ttf"),
          nanumSquareEB: require("./assets/fonts/NanumSquareEB.ttf"),
          nanumSquareB: require("./assets/fonts/NanumSquareB.ttf"),
          nanumSquareR: require("./assets/fonts/NanumSquareR.ttf"),
          tjB: require("./assets/fonts/TJJoyofsingingB_TTF.ttf"),
          tjEB: require("./assets/fonts/TJJoyofsingingEB_TTF.ttf"),
          tjL: require("./assets/fonts/TJJoyofsingingL_TTF.ttf"),
          tjM: require("./assets/fonts/TJJoyofsingingM_TTF.ttf"),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setAppIsLoaded(true);
      }
    };
    prepare();
  }, []);

  if (!appIsLoaded) {
    return null; // 폰트 로딩 전에는 빈 화면
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style={"auto"} />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}
