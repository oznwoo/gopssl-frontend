import React, { useMemo, useRef } from "react";
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
  SearchInput,
  DetailInput,
  DateInput,
  TreatmentInput,
  TypeInput,
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

const SaleForm = ({ saleDate, data, mode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = useSelector((state) => state.auth.user);

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
          name: data.customer_name || "",
          saleDate: new Date(data.sale_date) || new Date(),
          paymentType: data.payment_type || "",
          detail: data.detail || "",
          treatmentList: reshapedTreatments || [],
          extraPrices: data.extra_prices || {},
          totalAmount: data.total_amount,
        }
      : {
          name: "",
          saleDate: saleDate || new Date(),
          paymentType: "",
          detail: "",
          treatmentList: [],
          extraPrices: {},
          totalAmount: 0,
        };

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const user_id = id;
      const customer_id = data?.customer_id || 5;

      const sale_date = new Date(values.saleDate).toISOString().split("T")[0];

      const treatments = values.treatmentList.map(
        ({ treatment_id, price }) => ({
          treatment_id,
          price,
        })
      );
      console.log(treatments);

      const saleData = {
        user_id,
        customer_id,
        sale_date,
        detail: values.detail,
        payment_type: values.paymentType,
        total_amount: values.totalAmount,
        treatments,
        extra_prices: values.extraPrices,
      };

      await dispatch(postSaleThunk(saleData));
      alert("매출 등록이 완료되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "등록 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values, { setSubmitting, setErrors }) => {
    try {
      const user_id = id;
      const customer_id = data?.customer_id;
      const sale_id = data?.id;

      const sale_date = new Date(values.saleDate).toISOString().split("T")[0];

      const treatments = values.treatmentList.map(
        ({ treatment_id, price }) => ({
          treatment_id,
          price,
        })
      );

      const saleData = {
        id: sale_id,
        user_id,
        customer_id,
        sale_date,
        detail: values.detail,
        payment_type: values.paymentType,
        total_amount: values.totalAmount,
        treatments,
        extra_prices: values.extraPrices,
      };

      await dispatch(updateSaleThunk(saleData));
      alert("고객 정보 수정이 완료되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "수정 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async ({ setSubmitting, setErrors }) => {
    try {
      const sale_id = data?.id;

      await dispatch(deleteSaleById(sale_id));
      alert("매출이 삭제되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.log("에러 상태코드:", error?.response?.status || error.message);
      setErrors({ submit: "삭제 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            <ScrollView>
              <View style={styles.inputContainer}>
                <SearchInput
                  id="name"
                  label="고객명"
                  useBlur={false}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  errorText={touched.name && errors.name}
                  editable={true}
                />
                <DateInput
                  id="saleDate"
                  label="시술일"
                  useBlur={false}
                  value={values.saleDate}
                  onChangeDate={(date) => setFieldValue("saleDate", date)}
                  onBlur={handleBlur("saleDate")}
                  errorText={touched.saleDate && errors.saleDate}
                  editable={true}
                />
                <TreatmentInput
                  id="treatments"
                  label="시술"
                  useBlur={false}
                  value={treatmentInputValue}
                  onBlur={handleBlur("treatmentList")}
                  errorText={touched.treatmentList && errors.treatmentList}
                  onTreatmentDataChange={({ treatments, extraPrices }) => {
                    setFieldValue("treatmentList", treatments);
                    setFieldValue("extraPrices", extraPrices);
                  }}
                  onTotalAmountChange={(amount) =>
                    setFieldValue("totalAmount", amount)
                  }
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
                  editable={true}
                />
                <DetailInput
                  id="detail"
                  label="시술 내용"
                  useBlur={false}
                  value={values.detail}
                  onChangeText={handleChange("detail")}
                  onBlur={handleBlur("detail")}
                  errorText={touched.detail && errors.detail}
                  editable={true}
                />
              </View>
            </ScrollView>
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
  submitButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
