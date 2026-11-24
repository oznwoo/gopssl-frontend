import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import SubmitButton from "./SubmitButton";
import { AddressSearchInput, BaseInput } from "./Input";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { UserSchema } from "../schemas/UserSchema";
import { registerUserInfo } from "../actions/userActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserForm = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const selectedAddress = route.params?.selectedAddress;
  const manualAddressParam = route.params?.manualAddress;
  // 검색 화면이 실패해 "직접 입력"을 고른 경우에만 주소 타이핑 허용
  const [manualAddress, setManualAddress] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // 초기값 세팅
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    storeName: user?.store_name || "",
    address: user?.address || "",
    addressDetail: user?.address_detail || "",
    zipCode: user?.zip_code || "",
  };

  // 업데이트 핸들러
  const handleUpdate = async (values, { setSubmitting, setErrors }) => {
    try {
      const address = values.address.trim();
      // 주소를 직접 타이핑하면 그 자리에서 우편번호를 비운다 (onChangeText 참고).
      // 검색으로 고른 주소는 우편번호와 함께 저장한다
      const zipCode = values.zipCode;
      await dispatch(
        registerUserInfo({
          id: user.id,
          name: values.name,
          email: values.email,
          store_name: values.storeName,
          // 빈 주소는 null이 아닌 ""로 보낸다 (백엔드 PUT /users/me는 null을 "변경 안 함"으로 처리)
          address,
          address_detail: values.addressDetail.trim(),
          zip_code: zipCode,
        })
      );
      Alert.alert("알림", "회원 정보가 수정되었습니다.");
      navigation.navigate("Home", {
        screen: "Setting",
      });
    } catch (error) {
      console.error("수정 오류:", error);
      setErrors({ submit: "수정 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UserSchema}
      onSubmit={handleUpdate}
      enableReinitialize
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setValues,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => {
        useEffect(() => {
          if (selectedAddress) {
            // 주소·우편번호를 한 번에 넣는다. setFieldValue를 두 번 부르면 두 번째 검증이
            // 이전 값(빈 주소)으로 돌아 필수 에러가 남는다
            setValues((prev) => ({
              ...prev,
              address: selectedAddress.addressName,
              zipCode: selectedAddress.zipCode,
            }));
            setManualAddress(false);
            // 선택 후 재선택 시 효과 적용 안 되는 문제 방지를 위해 params 초기화
            navigation.setParams({ selectedAddress: undefined });
          }
        }, [selectedAddress]);

        useEffect(() => {
          if (manualAddressParam) {
            setManualAddress(true);
            navigation.setParams({ manualAddress: undefined });
          }
        }, [manualAddressParam]);

        const openAddressSearch = () => {
          setFieldTouched("address", true, false);
          navigation.navigate("AddressSearch", {
            backScreen: route.name,
            formData: values,
          });
        };
        return (
          <View
            style={[
              styles.formContainer,
              Platform.OS === "android"
                ? { paddingBottom: insets.bottom }
                : { paddingBottom: 20 },
            ]}
          >
            <ScrollView contentContainerStyle={styles.inputContainer}>
              <BaseInput
                id="name"
                label="이름"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                errorText={touched.name && errors.name}
              />

              <BaseInput
                id="email"
                label="이메일"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                errorText={touched.email && errors.email}
              />

              <BaseInput
                id="storeName"
                label="매장명"
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
                // 직접 입력한 주소에는 맞는 우편번호가 없으므로 같이 비운다
                onChangeText={(text) =>
                  setValues((prev) => ({ ...prev, address: text, zipCode: "" }))
                }
                onBlur={handleBlur("address")}
                onPressSearch={openAddressSearch}
                errorText={touched.address && errors.address}
              />

              {/* 검색 결과로만 채워지는 읽기 전용 칸 (직접 입력 시 빈 채로 둠) */}
              <BaseInput
                id="zipCode"
                label="우편번호"
                value={values.zipCode}
                placeholder="주소 검색 시 자동 입력"
                readOnly
              />

              <BaseInput
                id="addressDetail"
                label="상세 주소 (선택)"
                value={values.addressDetail}
                onChangeText={handleChange("addressDetail")}
                onBlur={handleBlur("addressDetail")}
                errorText={touched.addressDetail && errors.addressDetail}
              />
            </ScrollView>
            <View style={styles.submitContainer}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.purple} />
              ) : (
                <SubmitButton
                  title="저장"
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

export default UserForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    gap: 16,

    backgroundColor: colors.backgroundPurple,
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  submitContainer: {
    ...commonStyles.dropShadow,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
