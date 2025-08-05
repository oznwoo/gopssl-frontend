import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import colors from "../styles/color";
import { formatKoreanDate } from "../utils/format";
import { commonStyles } from "../styles/commonStyles";
import { getDailySalesSummary } from "../actions/saleStatistics";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

const DateHeader = ({ currentDate, onChangeDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [monthDate, setMonthDate] = useState(
    currentDate ? new Date(currentDate) : new Date()
  );
  const [salesByDate, setSalesByDate] = useState({});

  const formatDate = (date) => date.toISOString().split("T")[0];
  const parsedDate = new Date(currentDate);

  const formattedDate = formatKoreanDate(isExpanded ? monthDate : currentDate, {
    monthOnly: isExpanded,
  });

  // 월 변경 시마다 API 호출해서 매출 데이터 가져오기
  useEffect(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth() + 1; // 0 기반이라 +1

    getDailySalesSummary(year, month)
      .then((data) => setSalesByDate(data))
      .catch((e) => {
        console.error("매출 요약 조회 실패:", e);
        setSalesByDate({});
      });
  }, [monthDate]);

  const handleArrowPress = (direction) => {
    const newDate = new Date(isExpanded ? monthDate : parsedDate);

    if (isExpanded) {
      // 월 단위 이동 (onChangeDate 호출 X)
      newDate.setMonth(newDate.getMonth() + direction);
      newDate.setDate(1); // 안전하게 1일로 고정
      setMonthDate(newDate);
    } else {
      // 일 단위 이동 (onChangeDate 호출 O)
      newDate.setDate(newDate.getDate() + direction);
      onChangeDate(formatDate(newDate));
    }
  };

  const handleDayPress = (dayObj) => {
    onChangeDate(dayObj.dateString);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.horizontalHeader}>
          <TouchableOpacity
            onPress={() => handleArrowPress(-1)}
            style={[styles.arrowButton, styles.horizontalArrowButton]}
          >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleArrowPress(1)}
            style={[styles.arrowButton, styles.horizontalArrowButton]}
          >
            <FontAwesome5 name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={[styles.arrowButton, styles.verticalArrowButton]}
        >
          <FontAwesome5
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.calendarContainer}>
          {/* 요일 헤더 */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day, index) => (
              <Text
                key={index}
                style={[
                  styles.dayNameText,
                  index === 0 && { color: colors.alert }, // 일요일
                  index === 6 && { color: colors.green }, // 토요일
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* 캘린더 */}
          <Calendar
            key={formatDate(monthDate)} // 리렌더 트리거
            current={formatDate(monthDate)}
            onDayPress={handleDayPress}
            markedDates={{
              [formatDate(currentDate)]: {
                selected: true,
                // 여기 색상들은 dayComponent 커스텀 시 무시됨
                selectedColor: colors.purple,
                selectedTextColor: "#fff",
              },
            }}
            renderHeader={() => null} // 기본 헤더 제거
            hideDayNames={true}
            hideExtraDays={false}
            enableSwipeMonths={true}
            hideArrows={true}
            theme={{
              calendarBackground: "#f1ebf1",
              textDayFontSize: 12,
              textDayFontFamily: "gamtanBatangB",
              dayTextColor: colors.purple,
              textDisabledColor: colors.lightPurple,
              weekVerticalMargin: 0,
            }}
            style={styles.calendar}
            dayComponent={({ date, state, marking }) => {
              const isSelected = marking?.selected;
              const isSunday = new Date(date.dateString).getDay() === 0;
              const salesAmount = salesByDate[date.dateString]; // 매출 가져오기

              return (
                <TouchableOpacity
                  style={[
                    styles.dayContainer,
                    {
                      backgroundColor: isSelected
                        ? colors.purple
                        : "transparent",
                    },
                  ]}
                  onPress={() => handleDayPress(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isSelected
                          ? "#fff"
                          : state === "disabled"
                          ? colors.lightPurple
                          : isSunday
                          ? colors.alert // ✅ 일요일 숫자만 빨강
                          : colors.purple,
                      },
                    ]}
                  >
                    {date.day}
                  </Text>
                  {/* 매출 표시 */}
                  {salesAmount !== undefined ? (
                    <Text
                      style={[
                        styles.salesText,
                        {
                          color: isSelected
                            ? "#fff"
                            : state === "disabled"
                            ? colors.lightPurple
                            : isSunday
                            ? colors.alert // ✅ 일요일 숫자만 빨강
                            : colors.purple,
                        },
                      ]}
                    >
                      {salesAmount.toLocaleString()}원
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.salesText,
                        {
                          color: isSelected
                            ? "#fff"
                            : state === "disabled"
                            ? colors.lightPurple
                            : isSunday
                            ? colors.alert // ✅ 일요일 숫자만 빨강
                            : colors.purple,
                        },
                      ]}
                    >
                      미등록
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default DateHeader;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 4,
    marginBottom: 28,
  },
  horizontalHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  arrowButton: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    ...commonStyles.dropShadow,
  },
  horizontalArrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verticalArrowButton: {
    position: "absolute",
    top: 44,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
  },
  dateText: {
    fontFamily: "gamtanDotumB",
    letterSpacing: "-0.5",
    fontSize: 20,
    color: colors.purple,
  },
  calendarContainer: {
    backgroundColor: colors.backgroundPurple,
    borderRadius: 12,
    padding: 12,
    paddingTop: 16,
    ...commonStyles.dropShadow,
  },
  dayNamesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 12,
  },
  dayNameText: {
    textAlign: "center",
    color: colors.purple,
    fontSize: 16,
    fontFamily: "gamtanBatangB",
  },
  calendar: {
    borderTopWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
  },
  dayContainer: {
    width: "100%",
    borderRadius: 8, // 둥근 직사각형
    paddingVertical: 8,
    alignItems: "center",
    gap: 4,
  },
  dayText: { fontFamily: "gamtanBatangB", fontSize: 14 },
  salesText: {
    fontSize: 6,
    color: colors.purple,
    fontFamily: "nanumSquareR",
  },
});
