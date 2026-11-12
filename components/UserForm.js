import React, { useEffect } from "react";
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
import { BaseInput } from "./Input";
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
      // 우편번호 칸은 숨김. 주소를 직접 바꾸면 기존(검색으로 채운) 우편번호는 맞지 않으므로 비운다
      const zipCode =
        address === initialValues.address.trim() ? values.zipCode : "";
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
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
      }) => {
        useEffect(() => {
          if (selectedAddress) {
            setFieldValue("address", selectedAddress.addressName);
            setFieldValue("zipCode", selectedAddress.zipCode);
            // 선택 후 재선택 시 효과 적용 안 되는 문제 방지를 위해 params 초기화도 고려
            navigation.setParams({ selectedAddress: undefined });
          }
        }, [selectedAddress]);
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

              {/* 주소 검색(카카오)은 운영 키 부재로 숨김. 직접 입력만 지원.
                  AddressSearchInput / AddressSearchScreen은 검색 API 교체 시 재사용 검토 */}
              <BaseInput
                id="address"
                label={"주소 (선택)"}
                autoCapitalize="none"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                errorText={touched.address && errors.address}
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
