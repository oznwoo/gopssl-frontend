import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BaseInput from "./BaseInput";
import colors from "../../styles/color";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const formattedDate = (date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

const DateInput = ({ value, onChangeDate, ...rest }) => {
  const [date, setDate] = useState(value || new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (value && value.getTime() !== date.getTime()) {
      setDate(value);
    }
  }, [value]);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      onChangeDate?.(selectedDate); // Date 객체 그대로 전달
    }
    if (Platform.OS === "android") setShow(false);
  };

  return (
    <BaseInput {...rest} portraitMode={true}>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.textInput}
          value={formattedDate(date)}
          editable={false}
        />
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={styles.datePickerButton}
        >
          <FontAwesome6 name="calendar" size={16} color={colors.purple} />
        </TouchableOpacity>

        {show && Platform.OS === "ios" && (
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShow(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                  style={{ backgroundColor: "white" }}
                />
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setShow(false)}
                >
                  <Text style={{ color: colors.purple, padding: 16 }}>
                    확인
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {show && Platform.OS === "android" && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </BaseInput>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  dateInputContainer: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.secondPurple,
    borderRadius: 16,
    padding: 8,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontFamily: "nanumSquareR",
    fontSize: 12,
  },
  datePickerButton: {},
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
});
