import React, { useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  ScrollView,
} from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { BaseInput, DetailInput, PhoneNumberInput } from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomerById,
  getAllCustomer,
  registerCustomer,
  updateCustomer,
} from "../actions/customerActions";
import { useNavigation } from "@react-navigation/native";
import { normalizeFont } from "../utils/responsive";
import CustomerSaleItem from "./CustomerSaleItem";
import { Text } from "react-native";

const CustomerForm = ({ data, mode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

  // 초깃값 설정: view 모드든 edit/등록 모드든 기본적으로 수정 가능한 값으로 세팅
  const initialValues =
    mode === "view" && data
      ? {
          name: data.name,
          phoneNumber: data.phone_number ? data.phone_number : "",
          detail: data.detail ? data.detail : "",
        }
      : { name: "", phoneNumber: "", detail: "" };

  // 등록 핸들러
  const handleRegister = (values, { setSubmitting, setErrors }) => {
    Alert.alert(
      "등록 확인",
      "고객을 등록하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => setSubmitting(false) },
        {
          text: "등록",
          style: "default",
          onPress: async () => {
            try {
              await dispatch(
                registerCustomer({
                  user_id: id,
                  name: values.name,
                  phone_number: values.phoneNumber,
                  detail: values.detail,
                })
              );
              Alert.alert("알림", "고객 등록이 완료되었습니다.");
              dispatch(getAllCustomer());
              navigation.navigate("Home");
            } catch (error) {
              console.log(
                "에러 상태코드:",
                error?.response?.status || error.message
              );
              setErrors({ submit: "등록 중 문제가 발생했습니다." });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 수정 핸들러
  const handleUpdate = (values, { setSubmitting, setErrors }) => {
    Alert.alert(
      "수정 확인",
      "수정하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => setSubmitting(false) },
        {
          text: "수정",
          style: "default",
          onPress: async () => {
            try {
              await dispatch(
                updateCustomer({
                  customer_id: data.id,
                  user_id: id,
                  name: values.name,
                  phone_number: values.phoneNumber,
                  detail: values.detail,
                })
              );
              Alert.alert("알림", "고객 정보 수정이 완료되었습니다.");
              dispatch(getAllCustomer());
              navigation.navigate("Home");
            } catch (error) {
              console.log(
                "에러 상태코드:",
                error?.response?.status || error.message
              );
              setErrors({ submit: "수정 중 문제가 발생했습니다." });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = () => {
    const customerId = data?.id;

    Alert.alert(
      "삭제 확인",
      "고객 정보를 삭제하시겠습니까?\n⚠️ 고객을 삭제하시면 해당 고객으로 등록된 모든 매출이 함께 삭제됩니다. ⚠️",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteCustomerById(customerId));
              Alert.alert("알림", "고객이 삭제되었습니다.");
              navigation.goBack();
            } catch (error) {
              console.log(
                "에러 상태코드:",
                error?.response?.status || error.message
              );
              Alert.alert("오류", "삭제 중 문제가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const transitionSale = useCallback(
    (itemId = undefined, date) => {
      const baseParams = {
        saleDate: date,
        mode: "view",
      };

      navigation.navigate("Sale", { ...baseParams, itemId });
    },
    [navigation]
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CustomerSchema}
      onSubmit={mode === "view" ? handleUpdate : handleRegister} // view 모드에서도 수정 처리
      enableReinitialize
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.inputContainer}>
            <BaseInput
              id="name"
              label="고객명"
              useBlur={false}
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              errorText={touched.name && errors.name}
              editable={true} // 항상 수정 가능
            />
            <PhoneNumberInput
              id="phoneNumber"
              label="전화번호"
              useBlur={false}
              value={values.phoneNumber}
              onChangePhoneNumber={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              errorText={touched.phoneNumber && errors.phoneNumber}
              portraitMode={true}
              editable={true} // 수정 가능
            />
            <DetailInput
              id="detail"
              label="비고"
              useBlur={false}
              value={values.detail}
              onChangeText={handleChange("detail")}
              onBlur={handleBlur("detail")}
              errorText={touched.detail && errors.detail}
              portraitMode={true}
              editable={true} // 수정 가능
            />

            {mode === "view" && (
              <View style={styles.salesContainer}>
                <View style={styles.salesItemContainer}>
                  <View style={styles.boxHeader}>
                    <Text style={styles.boxTitle}>방문 기록</Text>
                    <Text
                      style={[
                        styles.boxTitle,
                        {
                          color: "#000",
                          fontSize: normalizeFont(16),
                          fontFamily: "nanumSquareB",
                        },
                      ]}
                    >
                      {data.num_of_visits ? `${data.num_of_visits}회` : "0회"}
                    </Text>
                  </View>
                  <View style={styles.tableContainer}>
                    <Text style={styles.tableTitle}>방문일</Text>
                    <Text style={[styles.tableTitle]}>시술 목록</Text>
                    <Text style={[styles.tableTitle]}>시술 내용</Text>
                    <Text style={[styles.tableTitle, { borderRightWidth: 0 }]}>
                      합계
                    </Text>
                  </View>
                  <View>
                    {data?.sales.map((item) => {
                      return (
                        <CustomerSaleItem
                          key={item.id}
                          item={item}
                          transitionSale={transitionSale}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          <View style={styles.submitContainer}>
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={colors.purple}
                style={{ marginTop: 10 }}
              />
            ) : mode === "view" ? (
              <View style={styles.submitButtons}>
                <SubmitButton
                  title={"수정"}
                  onPress={handleSubmit}
                  size={"small"}
                  disable={!isValid || !dirty}
                />
                <SubmitButton
                  title={"삭제"}
                  size={"small"}
                  onDelete={handleDelete}
                />
              </View>
            ) : (
              <SubmitButton
                title={"등록"}
                onPress={handleSubmit}
                disable={!isValid || !dirty}
              />
            )}
          </View>
        </View>
      )}
    </Formik>
  );
};

export default CustomerForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundPurple,
    justifyContent: "space-between",
  },
  inputContainer: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  submitContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saleItemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,

    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,

    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salesContainer: { gap: 6 },
  salesItemContainer: {
    backgroundColor: "#fff",
    borderColor: "#EDECF4",
    borderRadius: 8,

    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  boxHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxTitle: {
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  tableContainer: {
    marginTop: 12,
    marginBottom: 4,
    flexDirection: "row",
    width: "110%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  tableTitle: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    textAlign: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  dateText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(20),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  detailText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(12),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  detailContainer: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 8,
    padding: 8,
    gap: 12,
  },
  detailContentText: {
    fontFamily: "nanumSqaureR",
    fontSize: normalizeFont(10),
    color: "#000",
    lineHeight: 12,
  },
  saleInfoButton: {
    paddingLeft: 8,
  },
});
