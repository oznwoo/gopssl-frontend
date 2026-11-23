import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../styles/color";
import SubmitButton from "./SubmitButton";
import { Formik } from "formik";
import { InfoSchema } from "../schemas/InfoSchema";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUserInfo } from "../actions/userActions";
import { seedDefaultTreatments } from "../actions/treatmentActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddressSearchInput, BaseInput } from "./Input";
import { normalizeFont } from "../utils/responsive";

const InfoForm = ({ setFormType }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const selectedAddress = route.params?.selectedAddress;
  const manualAddressParam = route.params?.manualAddress;
  // 검색 화면이 실패해 "직접 입력"을 고른 경우에만 주소 타이핑 허용
  const [manualAddress, setManualAddress] = useState(false);
  const userData = useSelector((state) => state.auth.user);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(
        registerUserInfo({
          ...userData,
          store_name: values.storeName,
          // 빈 주소는 null이 아닌 ""로 보낸다 (백엔드 PUT /users/me는 null을 "변경 안 함"으로 처리)
          address: values.address.trim(),
          zip_code: values.zipCode.trim(),
          address_detail: values.addressDetail.trim(),
        })
      );

      // 신규 가입 시 기본 시술 메뉴 자동 등록 (실패해도 흐름은 계속)
      await dispatch(seedDefaultTreatments());

      await AsyncStorage.setItem("@viewedOnboarding", "true");
      navigation.navigate("OnboardingScreen");
    } catch (error) {
      console.log("에러 상태코드:", error.message); // 여기서 접근 가능!

      // 400은 중복 이메일 에러로 처리
      if (error.status === 400) {
        setErrors({ email: error.message });
      } else {
        setErrors({ password: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        storeName: route?.params?.formData?.storeName || "",
        address: route?.params?.formData?.address || "",
        zipCode: route?.params?.formData?.zipCode || "",
        addressDetail: route?.params?.formData?.addressDetail || "",
      }}
      validationSchema={InfoSchema}
      onSubmit={handleSubmit}
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
        setFieldValue,
        setFieldTouched,
      }) => {
        useEffect(() => {
          if (selectedAddress) {
            setFieldValue("address", selectedAddress.addressName);
            setFieldValue("zipCode", selectedAddress.zipCode);
            setManualAddress(false);
            // 선택 후 재선택 시 효과 적용 안 되는 문제 방지를 위해 params 초기화
            navigation.setParams({ selectedAddress: undefined });
          }
        }, [selectedAddress]);

        useEffect(() => {
          if (manualAddressParam) {
            setManualAddress(true);
            // 직접 입력한 주소에는 맞는 우편번호가 없으므로 비운다
            setFieldValue("zipCode", "");
            navigation.setParams({ manualAddress: undefined });
          }
        }, [manualAddressParam]);

        const openAddressSearch = () => {
          setFieldTouched("address", true, false);
          navigation.navigate("AddressSearchScreen", {
            backScreen: route.name,
            formData: values,
          });
        };
        return (
          <View style={styles.formContainer}>
            <View style={styles.contentContainer}>
              <BaseInput
                id="store_name"
                label={"매장명"}
                autoCapitalize="none"
                value={values.storeName}
                onChangeText={handleChange("storeName")}
                onBlur={handleBlur("storeName")}
                errorText={touched.storeName && errors.storeName}
              />
              {/* 주소는 필수. 칸을 누르면 우편번호 검색(WebView), 검색 실패 시에만 직접 입력 */}
              <AddressSearchInput
                id="address"
                label={"주소"}
                autoCapitalize="none"
                manual={manualAddress}
                value={values.address}
                onChangeText={(text) => {
                  setFieldValue("address", text);
                  setFieldValue("zipCode", "");
                }}
                onBlur={handleBlur("address")}
                onPressSearch={openAddressSearch}
                errorText={touched.address && errors.address}
              />

              {/* 검색 결과로만 채워지는 읽기 전용 칸 (직접 입력 시 빈 채로 둠) */}
              <BaseInput
                id="zip_code"
                label={"우편번호"}
                value={values.zipCode}
                placeholder="주소 검색 시 자동 입력"
                readOnly
              />

              <BaseInput
                id="address_detail"
                label={"상세주소 (선택)"}
                autoCapitalize="none"
                value={values.addressDetail}
                onChangeText={handleChange("addressDetail")}
                onBlur={handleBlur("addressDetail")}
                errorText={touched.addressDetail && errors.addressDetail}
              />
            </View>

            <View style={styles.contentContainer}>
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={colors.purple}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <SubmitButton
                  title={"완료"}
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

export default InfoForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 24,
    width: "100%",
    marginBottom: 28,
  },
  contentContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDECF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  inputTitle: {
    fontSize: normalizeFont(16),
    fontFamily: "nanumSquareR",
    color: colors.purple,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
  },
  purpleButton: {
    backgroundColor: colors.purple,
    borderColor: "rgba(216, 29, 223, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  purpleButtonText: {
    color: "white",
    fontFamily: "tjM",
    fontSize: normalizeFont(16),
    letterSpacing: -1,
    textAlign: "center",
  },
  transitionButton: {
    alignSelf: "flex-end",
  },

  transitionText: {
    color: "#2E2B1C",
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(12),
  },
});
