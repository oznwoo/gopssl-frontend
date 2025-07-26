import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";

const PasswordInput = ({ value, onChangeText, ...rest }) => {
  const [secure, setSecure] = useState(true);

  return (
    <BaseInput
      {...rest}
      inputProps={{
        value,
        onChangeText,
        secureTextEntry: secure,
      }}
      rightIcon={
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <MaterialCommunityIcons
            name={secure ? "eye" : "eye-off"}
            size={24}
            color={colors.purple}
          />
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;
