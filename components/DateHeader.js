import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import colors from "../styles/color";
import { formatKoreanDate } from "../utils/format";
import { commonStyles } from "../styles/commonStyles";
import { getDailySalesSummary } from "../actions/saleStatisticsActions";
import { normalizeFont, normalizeSize } from "../utils/responsive";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

const DateHeader = ({ currentDate, onChangeDate, onlyCalendar }) => {
  const [isExpanded, setIsExpanded] = useState(onlyCalendar);
  const [monthDate, setMonthDate] = useState(
    currentDate ? new Date(currentDate) : new Date()
  );
  const [salesByDate, setSalesByDate] = useState({});
  const DayComponent = onlyCalendar ? View : TouchableOpacity;

  const formatDate = (date) => date.toISOString().split("T")[0];
  const parsedDate = new Date(currentDate);

  // 오늘 날짜 고정
  const todayDate = new Date();
  const todayString = formatDate(todayDate);

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
    if (isExpanded) {
      // 캘린더(expanded) 모드: 월 단위 이동
      const newMonthDate = new Date(monthDate);
      newMonthDate.setMonth(newMonthDate.getMonth() + direction);
      newMonthDate.setDate(1);
      setMonthDate(newMonthDate);
      onChangeDate(formatDate(newMonthDate));
    } else {
      // 일반(축소) 모드: 일 단위 이동
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + direction);
      onChangeDate(formatDate(newDate));
    }
  };

  const handleDayPress = (dayObj) => {
    // onlyCalendar 모드에서는 날짜 변경하지 않음
    if (onlyCalendar) return;

    if (dayObj.dateString === formatDate(currentDate)) return;
    onChangeDate(dayObj.dateString);
  };

  // markedDates 설정 - onlyCalendar 모드에서는 오늘 날짜만, 일반 모드에서는 currentDate
  const getMarkedDates = () => {
    if (onlyCalendar) {
      // onlyCalendar 모드: 오늘 날짜만 하이라이트
      return {
        [todayString]: {
          selected: true,
          selectedColor: colors.purple,
          selectedTextColor: "#fff",
        },
      };
    } else {
      // 일반 모드: 상위에서 받은 currentDate 날짜 하이라이트
      return {
        [formatDate(currentDate)]: {
          selected: true,
          selectedColor: colors.purple,
          selectedTextColor: "#fff",
        },
      };
    }
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

        {onlyCalendar ? (
          <View style={styles.horizontalLine}></View>
        ) : (
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
        )}
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
            markedDates={getMarkedDates()} // 수정된 부분
            renderHeader={() => null} // 기본 헤더 제거
            hideDayNames={true}
            hideExtraDays={false}
            hideArrows={true}
            enableSwipeMonths={true}
            onMonthChange={(month) => {
              const newMonthDate = new Date(month.dateString);
              setMonthDate(newMonthDate);
              onChangeDate(formatDate(newMonthDate)); // 필요하면 상위로 전달
            }}
            theme={{
              calendarBackground: "#f1ebf1",
              textDayFontSize: normalizeFont(12),
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

              const isFuture = new Date(date.dateString) > todayDate;
              let displayText;
              if (salesAmount !== undefined) {
                displayText = `${salesAmount.toLocaleString()}원`;
              } else {
                displayText = isFuture ? "미등록" : "0원";
              }

              return (
                <DayComponent
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
                  <Text
                    style={[
                      styles.salesText,
                      {
                        color: isSelected
                          ? "#fff"
                          : state === "disabled"
                          ? colors.lightPurple
                          : isSunday
                          ? colors.alert
                          : colors.purple,
                      },
                    ]}
                  >
                    {displayText}
                  </Text>
                </DayComponent>
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
    backgroundColor: "tranparent",
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 28,
    width: "100%",
    gap: 10,
  },
  horizontalHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  horizontalLine: {
    width: "120%",
    position: "absolute",
    top: normalizeSize(56),
    zIndex: 20,
    height: 2,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
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
    letterSpacing: -0.5,
    fontSize: normalizeFont(20),
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
    fontSize: normalizeFont(16),
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
  dayText: { fontFamily: "gamtanBatangB", fontSize: normalizeFont(14) },
  salesText: {
    fontSize: normalizeFont(6),
    color: colors.purple,
    fontFamily: "nanumSquareB",
  },
});
