import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";

const AddressSearchInput = ({ onPressIcon, value, onChangeText, ...rest }) => {
  return (
    <BaseInput
      {...rest}
      inputProps={{ value, onChangeText }}
      rightIcon={
        <TouchableOpacity onPress={onPressIcon}>
          <Ionicons name="search" size={24} color={colors.purple} />
        </TouchableOpacity>
      }
    />
  );
};

export default AddressSearchInput;
