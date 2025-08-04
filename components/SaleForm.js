import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SubmitButton from "./SubmitButton";
import colors from "../styles/color";
import { Formik } from "formik";
import {
  AddressInput,
  DetailInput,
  DateInput,
  TreatmentInput,
  TypeInput,
} from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SaleSchema } from "../schemas/SaleSchema";
import { postSaleThunk } from "../actions/saleActions";
import { commonStyles } from "../styles/commonStyles";

// 💡 총액 계산 함수 분리
const calculateTotalAmount = (treatmentList, extraPrices) => {
  const treatmentTotal = treatmentList.reduce(
    (acc, cur) => acc + (cur.price || 0),
    0
  );
  const extraTotal = Object.values(extraPrices || {}).reduce(
    (acc, cur) => acc + (cur || 0),
    0
  );
  return treatmentTotal + extraTotal;
};

const SaleForm = ({ saleDate }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const user_id = id;
      const customer_id = 3;

      const sale_date = new Date(values.saleDate).toISOString().split("T")[0];

      const treatments = values.treatmentList.map(
        ({ treatment_id, price }) => ({
          treatment_id,
          price,
        })
      );

      const total_amount = calculateTotalAmount(treatments, values.extraPrices);

      const saleData = {
        user_id,
        customer_id,
        sale_date,
        detail: values.detail,
        payment_type: values.paymentType,
        total_amount,
        treatments,
        extra_prices: values.extraPrices,
      };

      await dispatch(postSaleThunk(saleData));
      alert("고객 등록이 완료되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "등록 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        saleDate: new Date(),
        paymentType: "",
        detail: "",
        treatmentList: [],
        extraPrices: {},
      }}
      validationSchema={SaleSchema}
      onSubmit={handleRegister}
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
        const totalAmount = calculateTotalAmount(
          values.treatmentList,
          values.extraPrices
        );

        return (
          <View style={styles.formContainer}>
            <ScrollView>
              <View style={styles.inputContainer}>
                <AddressInput
                  id="name"
                  label="고객명"
                  useBlur={false}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  errorText={touched.name && errors.name}
                  onPressIcon={() => {}}
                />
                <DateInput
                  id="saleDate"
                  label="시술일"
                  useBlur={false}
                  value={values.saleDate}
                  onChangeDate={(date) => setFieldValue("saleDate", date)}
                  onBlur={handleBlur("saleDate")}
                  errorText={touched.saleDate && errors.saleDate}
                />
                <TreatmentInput
                  id="treatments"
                  label="시술"
                  useBlur={false}
                  onBlur={handleBlur("treatmentList")}
                  errorText={touched.treatmentList && errors.treatmentList}
                  onTreatmentDataChange={({ treatments, extraPrices }) => {
                    setFieldValue("treatmentList", treatments);
                    setFieldValue("extraPrices", extraPrices);
                  }}
                />
                <TypeInput
                  id="paymentType"
                  label="결제 유형"
                  useBlur={false}
                  value={values.paymentType}
                  options={["현금", "카드"]}
                  onChange={(val) => setFieldValue("paymentType", val)}
                  onBlur={handleBlur("paymentType")}
                  errorText={touched.paymentType && errors.paymentType}
                />
                <DetailInput
                  id="detail"
                  label="시술 내용"
                  useBlur={false}
                  value={values.detail}
                  onChangeText={handleChange("detail")}
                  onBlur={handleBlur("detail")}
                  errorText={touched.detail && errors.detail}
                />
              </View>
            </ScrollView>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                금액: {totalAmount.toLocaleString()}원
              </Text>
            </View>
            <View style={styles.submitContainer}>
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={colors.purple}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <SubmitButton
                  title={"등록"}
                  onPress={handleSubmit}
                  disable={!isValid || !dirty}
                />
              )}
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

export default SaleForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPurple,
  },
  inputContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  submitContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  totalContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOffset: { width: 0, height: -1 },
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalText: {
    fontFamily: "gamtanBatangB",
    fontSize: 24,
    letterSpacing: "-0.5",
    color: colors.purple,
  },
});
