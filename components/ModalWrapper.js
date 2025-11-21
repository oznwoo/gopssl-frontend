import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

const ModalWrapper = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* Pressable로 감싸서 모달 컨텐츠 클릭 시 닫히지 않도록 함 */}
          <Pressable style={styles.modalContentWrapper} onPress={() => {}}>
            {children}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    width: "80%",
  },
});
