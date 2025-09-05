import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View, Easing } from "react-native";

const AnimatedText = ({
  texts = [],
  interval = 5500,
  style = {},
  textHeight = 20,
}) => {
  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      // 위로 올리는 애니메이션
      Animated.timing(translateY, {
        toValue: -textHeight,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // 애니메이션 끝난 후 index 변경 (setTimeout으로 defer)
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
          translateY.setValue(textHeight); // 바로 아래로 위치시킴
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }, 0);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval, textHeight]);

  return (
    <View
      style={{
        height: textHeight,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Text style={style}>{texts[index]}</Text>
      </Animated.View>
    </View>
  );
};

export default AnimatedText;
