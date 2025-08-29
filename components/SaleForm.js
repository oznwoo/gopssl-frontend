import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import {
  DetailInput,
  DateInput,
  TreatmentInput,
  TypeInput,
  CustomerSearchInput,
} from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SaleSchema } from "../schemas/SaleSchema";
import {
  deleteSaleById,
  postSaleThunk,
  updateSaleThunk,
} from "../actions/saleActions";
import { commonStyles } from "../styles/commonStyles";
import { getAllCustomer, registerCustomer } from "../actions/customerActions";
import { normalizeFont } from "../utils/responsive";

const SaleForm = ({ saleDate, data, mode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);
  const scrollViewRef = useRef(null);

  // 각 입력 필드의 Y 위치를 저장할 객체
  const inputPositions = useRef({});

  // 키보드가 올라올 때 해당 필드로 스크롤하는 함수
  const scrollToInput = (inputId) => {
    if (
      scrollViewRef.current &&
      inputPositions.current[inputId] !== undefined
    ) {
      setTimeout(() => {
        const inputY = inputPositions.current[inputId];
        const keyboardHeight = Platform.OS === "ios" ? 280 : 250;

        // 👇 fixedBottomContainer 높이 측정
        const bottomContainerHeight = Platform.OS === "ios" ? 0 : 180;
        const additionalPadding = 100;

        const availableHeight =
          Dimensions.get("window").height -
          keyboardHeight -
          bottomContainerHeight;

        const targetY = inputY - availableHeight / 3;
        const scrollY = Math.max(0, targetY - additionalPadding);

        scrollViewRef.current.scrollTo({ y: scrollY, animated: true });
      }, 150);
    }
  };

  // 입력 필드의 위치를 저장하는 함수
  const handleInputLayout = (inputId, event) => {
    const { y } = event.nativeEvent.layout;
    inputPositions.current[inputId] = y;
  };

  const reshapedTreatments = data?.treatments?.map((item) => {
    const newItem = {
      treatment_id: item.treatment_id,
      price: item.price,
    };

    return newItem;
  });

  const initialValues =
    mode === "view" && data
      ? {
          customerId: data.customer_id || -1,
          name: data.customer_name || "",
          saleDate: new Date(data.sale_date) || new Date(),
          paymentType: data.payment_type || "",
          detail: data.detail || "",
          treatmentList: reshapedTreatments || [],
          extraPrices: data.extra_prices || {},
          totalAmount: data.total_amount,
        }
      : {
          customerId: -1,
          name: "",
          saleDate: saleDate || new Date(),
          paymentType: "",
          detail: "",
          treatmentList: [],
          extraPrices: {},
          totalAmount: 0,
        };

  // 등록 핸들러
  const handleRegister = (values, formikHelpers) => {
    const { setSubmitting, setErrors } = formikHelpers;

    Alert.alert(
      "등록 확인",
      "매출을 등록하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "등록",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              let customer_id = values.customerId;

              if (values.customerId < 0) {
                const res = await dispatch(registerCustomer({ user_id: id }));
                customer_id = res.id;
                dispatch(getAllCustomer());
              }

              const sale_date = new Date(values.saleDate)
                .toISOString()
                .split("T")[0];

              const treatments = values.treatmentList.map(
                ({ treatment_id, price }) => ({ treatment_id, price })
              );

              const saleData = {
                user_id: id,
                customer_id,
                sale_date,
                detail: values.detail,
                payment_type: values.paymentType,
                total_amount: values.totalAmount,
                treatments,
                extra_prices: values.extraPrices,
              };

              await dispatch(postSaleThunk(saleData));
              Alert.alert("알림", "매출 등록이 완료되었습니다.");
              navigation.goBack();
            } catch (error) {
              console.log(error);
              setErrors({ submit: "등록 중 오류가 발생했습니다." });
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
  const handleUpdate = (values, formikHelpers) => {
    const { setSubmitting, setErrors } = formikHelpers;

    Alert.alert(
      "수정 확인",
      "매출 정보를 수정하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
          onPress: () => {
            setSubmitting(false);
          },
        },
        {
          text: "수정",
          style: "default",
          onPress: async () => {
            setSubmitting(true);
            try {
              const customer_id = values.customerId;
              const sale_id = data?.id;
              const sale_date = new Date(values.saleDate)
                .toISOString()
                .split("T")[0];

              const treatments = values.treatmentList.map(
                ({ treatment_id, price }) => ({ treatment_id, price })
              );

              const saleData = {
                id: sale_id,
                user_id: id,
                customer_id,
                sale_date,
                detail: values.detail,
                payment_type: values.paymentType,
                total_amount: values.totalAmount,
                treatments,
                extra_prices: values.extraPrices,
              };

              await dispatch(updateSaleThunk(saleData));
              Alert.alert("알림", "고객 정보 수정이 완료되었습니다.");
              navigation.goBack();
            } catch (error) {
              console.log(error);
              setErrors({ submit: "수정 중 오류가 발생했습니다." });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 삭제 핸들러
  const handleDelete = () => {
    const sale_id = data?.id;

    Alert.alert(
      "삭제 확인",
      "매출을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => {} },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteSaleById(sale_id));
              Alert.alert("알림", "매출이 삭제되었습니다.");
              navigation.goBack();
            } catch (error) {
              console.log(error);
              setErrors({ submit: "삭제 중 오류가 발생했습니다." });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 32} // 헤더 높이만큼 조정
    >
      <Formik
        initialValues={initialValues}
        validationSchema={SaleSchema}
        onSubmit={mode === "view" ? handleUpdate : handleRegister}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          dirty,
        }) => {
          // 핵심: useMemo로 value를 감싸줍니다!
          const treatmentInputValue = useMemo(
            () => [values.treatmentList, values.extraPrices],
            [values.treatmentList, values.extraPrices]
          );

          return (
            <View style={styles.formContainer}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputContainer}>
                  <View onLayout={(event) => handleInputLayout("name", event)}>
                    <CustomerSearchInput
                      id="name"
                      label="고객명"
                      useBlur={false}
                      value={values.name}
                      onChangeText={(customerId, name) => {
                        setFieldValue("customerId", customerId);
                        setFieldValue("name", name);
                      }}
                      onBlur={handleBlur("name")}
                      onFocus={() => scrollToInput("name")}
                      errorText={touched.name && errors.name}
                      editable={true}
                      mode={mode}
                    />
                  </View>
                  <View
                    onLayout={(event) => handleInputLayout("saleDate", event)}
                  >
                    <DateInput
                      id="saleDate"
                      label="시술일"
                      useBlur={false}
                      value={values.saleDate}
                      onChangeDate={(date) => setFieldValue("saleDate", date)}
                      onBlur={handleBlur("saleDate")}
                      onFocus={() => scrollToInput("saleDate")}
                      errorText={touched.saleDate && errors.saleDate}
                      editable={true}
                    />
                  </View>
                  <View
                    onLayout={(event) => handleInputLayout("treatments", event)}
                  >
                    <TreatmentInput
                      id="treatments"
                      label="시술"
                      useBlur={false}
                      value={treatmentInputValue}
                      onBlur={handleBlur("treatmentList")}
                      onFocus={() => scrollToInput("treatments")}
                      errorText={touched.treatmentList && errors.treatmentList}
                      onTreatmentDataChange={({ treatments, extraPrices }) => {
                        setFieldValue("treatmentList", treatments);
                        setFieldValue("extraPrices", extraPrices);
                      }}
                      onTotalAmountChange={(amount) =>
                        setFieldValue("totalAmount", amount)
                      }
                    />
                  </View>
                  <View
                    onLayout={(event) =>
                      handleInputLayout("paymentType", event)
                    }
                  >
                    <TypeInput
                      id="paymentType"
                      label="결제 유형"
                      useBlur={false}
                      value={values.paymentType}
                      options={["현금", "카드"]}
                      onChange={(val) => setFieldValue("paymentType", val)}
                      onBlur={handleBlur("paymentType")}
                      onFocus={() => scrollToInput("paymentType")}
                      errorText={touched.paymentType && errors.paymentType}
                      editable={true}
                    />
                  </View>
                  <View
                    onLayout={(event) => handleInputLayout("detail", event)}
                  >
                    <DetailInput
                      id="detail"
                      label="시술 내용"
                      useBlur={false}
                      value={values.detail}
                      onChangeText={handleChange("detail")}
                      onBlur={handleBlur("detail")}
                      onFocus={() => scrollToInput("detail")}
                      errorText={touched.detail && errors.detail}
                      editable={true}
                    />
                  </View>
                </View>
                {/* ScrollView 내부 여백 추가 - 키보드를 위한 충분한 공간 확보 */}
                <View style={styles.bottomSpacing} />
              </ScrollView>

              <View style={styles.fixedBottomContainer}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>
                    금액: {values.totalAmount.toLocaleString()}원
                  </Text>
                </View>
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
            </View>
          );
        }}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default SaleForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  bottomSpacing: {
    height: Platform.OS === "ios" ? 300 : 250, // 키보드 높이보다 조금 더 큰 여백
  },
  fixedBottomContainer: {
    backgroundColor: colors.backgroundPurple,
  },
  submitContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  totalContainer: {
    borderBottomColor: colors.backgroundPurple,
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOffset: { width: 0, height: -1 },
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalText: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(20),
    letterSpacing: -0.5,
    color: colors.purple,
  },
  submitButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
