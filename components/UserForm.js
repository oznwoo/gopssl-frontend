import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import SubmitButton from "./SubmitButton";
import { BaseInput, AddressSearchInput } from "./Input";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { UserSchema } from "../schemas/UserSchema";
import { registerUserInfo } from "../actions/userActions";

const UserForm = () => {
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
      await dispatch(
        registerUserInfo({
          id: user.id,
          name: values.name,
          email: values.email,
          store_name: values.storeName,
          address: values.address,
          address_detail: values.addressDetail,
          zip_code: values.zipCode,
        })
      );
      alert("회원 정보가 수정되었습니다.");
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
          <ScrollView contentContainerStyle={styles.formContainer}>
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

            <AddressSearchInput
              id="address"
              label={"주소"}
              autoCapitalize="none"
              value={values.address}
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              errorText={touched.address && errors.address}
              onPressIcon={() => {
                navigation.navigate("AddressSearchScreen", {
                  backScreen: "Profile",
                });
              }}
              readOnly
            />

            <BaseInput
              id="zipCode"
              label="우편번호"
              value={values.zipCode}
              onChangeText={handleChange("zipCode")}
              onBlur={handleBlur("zipCode")}
              errorText={touched.zipCode && errors.zipCode}
              readOnly
            />

            <BaseInput
              id="addressDetail"
              label="상세 주소"
              value={values.addressDetail}
              onChangeText={handleChange("addressDetail")}
              onBlur={handleBlur("addressDetail")}
              errorText={touched.addressDetail && errors.addressDetail}
            />

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
          </ScrollView>
        );
      }}
    </Formik>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  submitContainer: {
    marginTop: 24,
    ...commonStyles.dropShadow,
  },
});
