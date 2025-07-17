import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import StartScreen from "./screens/StartScreen";

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          logo: require("./assets/fonts/BagelFatOne-Regular.ttf"),
          regular: require("./assets/fonts/NanumSquareR.ttf"),
          light: require("./assets/fonts/NanumSquareL.ttf"),
          extraBold: require("./assets/fonts/NanumSquareEB.ttf"),
          bold: require("./assets/fonts/NanumSquareB.ttf"),
        });
      } catch (error) {
        console.log.error();
      } finally {
        setAppIsLoaded(true);
      }
    };
    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <StartScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
