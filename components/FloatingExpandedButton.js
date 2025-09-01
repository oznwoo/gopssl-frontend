import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../styles/color";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont } from "../utils/responsive";
import { commonStyles } from "../styles/commonStyles";

const FloatingExpandButton = (props) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const transitionCustomer = () => {
    const baseParams = { mode: "register" };
    navigation.navigate("Customer", baseParams);
  };

  const transitionSale = () => {
    const baseParams = {
      saleDate: props.date ? props.date.toISOString() : undefined,
      mode: "register",
    };
    navigation.navigate("Sale", baseParams);
  };

  const toggle = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 97],
  });

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 97],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 16],
  });

  const iconOpacity = animation.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
  });

  const contentOpacity = animation.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      {expanded && (
        <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.buttonContainer,
          props.style,
          {
            width,
            height,
            borderRadius,
          },
        ]}
      >
        {expanded ? (
          // 펼쳐진 상태 → 개별 버튼만 터치 가능
          <View style={styles.fullSize}>
            <Animated.View
              style={[
                { position: "relative", top: 14 },
                { opacity: contentOpacity },
              ]}
            >
              <TouchableOpacity
                onPress={transitionSale}
                style={styles.registerButton}
              >
                <Text style={styles.registerText}>매출 등록</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity
                onPress={transitionCustomer}
                style={styles.registerButton}
              >
                <Text style={styles.registerText}>고객 등록</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          // 접힌 상태 → 전체 보라색 영역이 터치 가능
          <TouchableOpacity onPress={toggle} style={styles.fullSize}>
            <Animated.View style={{ ...styles.centered, opacity: iconOpacity }}>
              <FontAwesome5 name="plus" size={24} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.purple,
    ...commonStyles.dropShadow,
  },
  fullSize: {
    flex: 1,
  },
  centered: {
    position: "relative",
    top: 11,
    alignSelf: "center",
  },
  registerButton: { padding: 2 },
  registerText: {
    color: "#fff",
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareB",
    textAlign: "center",
  },
  separator: {
    height: 2,
    backgroundColor: "#fff",
    width: "100%",
    marginVertical: 12,
  },
});

export default FloatingExpandButton;
