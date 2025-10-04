import React, { useEffect, useRef, useState } from "react";
import BaseInput from "./BaseInput";
import { useDispatch } from "react-redux";
import { fetchTreatmentsThunk } from "../../actions/treatmentActions";
import TreatmentRegisterMenu from "../TreatmentRegisterMenu";

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

const TreatmentInput = ({
  onTreatmentDataChange,
  onTotalAmountChange,
  value,
  ...rest
}) => {
  const dispatch = useDispatch();

  // 내부 상태
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [extraPrices, setExtraPrices] = useState({});
  const prevPayloadRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTreatmentsThunk());
  }, [dispatch]);

  useEffect(() => {
    // 최초 비어있지 않은 props value가 들어왔을 때 딱 한 번만 실행
    if (value && Array.isArray(value[0]) && value[0].length > 0) {
      setSelectedTreatments(value[0]);
      setExtraPrices(value[1]);
      // 초기값 parent sync 필요시: onTreatmentDataChange({...});
    }
    // eslint-disable-next-line
  }, [value && value[0] && value[0].length]);

  // 폼 외부로 상태 변경 알림 (불필요한 브로드캐스트 방지)
  useEffect(() => {
    if (!onTreatmentDataChange) return;

    const result = selectedTreatments
      .filter((t) => t?.treatment_id && t?.price)
      .map((t) => ({
        treatment_id: t.treatment_id,
        price: t.price,
      }));

    const payload = {
      treatments: result,
      extraPrices,
    };

    const prev = JSON.stringify(prevPayloadRef.current);
    const curr = JSON.stringify(payload);

    if (prev !== curr) {
      onTreatmentDataChange(payload);
      prevPayloadRef.current = payload;
      onTotalAmountChange(
        calculateTotalAmount(payload.treatments, payload.extraPrices)
      );
    }
  }, [selectedTreatments, extraPrices, onTreatmentDataChange]);

  const toggleTreatment = (treatment) => {
    if (!treatment?.id) return;

    setSelectedTreatments((prev) => {
      const exists = prev.some((t) => t.treatment_id === treatment.id);
      const nextTreatments = exists
        ? prev.filter((t) => t.treatment_id !== treatment.id)
        : [
            ...prev,
            { treatment_id: treatment.id, price: treatment.default_price },
          ];

      // 부모 콜백 호출
      onTreatmentDataChange &&
        onTreatmentDataChange({
          nextTreatments,
          extraPrices,
        });
      return nextTreatments;
    });
  };

  const handleProductPriceChange = (treatment, text) => {
    const price = parseInt(text, 10) || 0;

    setSelectedTreatments((prev) => {
      const exists = prev.some((t) => t.treatment_id === treatment.id);
      let nextTreatments;
      if (exists) {
        // 이미 있으면 price 업데이트
        nextTreatments = prev.map((t) =>
          t.treatment_id === treatment.id ? { ...t, price } : t
        );
      } else {
        // 없으면 새로 추가
        nextTreatments = [...prev, { treatment_id: treatment.id, price }];
      }
      // 부모 콜백 호출
      onTreatmentDataChange &&
        onTreatmentDataChange({
          nextTreatments,
          extraPrices,
        });
      return nextTreatments;
    });
  };

  const handleExtraPriceChange = (category, text) => {
    const price = parseInt(text, 10) || 0;
    setExtraPrices((prev) => ({
      ...prev,
      [category]: price,
    }));
  };

  return (
    <BaseInput {...rest} portraitMode={true}>
      <TreatmentRegisterMenu
        selectedTreatments={selectedTreatments}
        onSelect={toggleTreatment}
        onPriceChange={handleProductPriceChange}
        extraPrices={extraPrices}
        onExtraPriceChange={handleExtraPriceChange}
      />
    </BaseInput>
  );
};

export default TreatmentInput;
