import { BytebankText } from "@/src/core/components/ui/text/text";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

dayjs.locale("pt-br");

interface MonthNavigatorProps {
  title?: string;
  onMonthChange?: (month: dayjs.Dayjs) => void;
  onPressDotsButton?: () => void;
}

export function MonthNavigator({
  onMonthChange,
  title,
  onPressDotsButton,
}: MonthNavigatorProps) {
  const { colors } = useTheme();

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const isCurrentMonth = currentMonth.isSame(dayjs(), "month");

  useEffect(() => {
    onMonthChange?.(currentMonth);
  }, []);

  const getCurrentDate = () => {
    const newMonth = dayjs();
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev.subtract(1, "month");
      onMonthChange?.(newMonth);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev.add(1, "month");
      onMonthChange?.(newMonth);
      return newMonth;
    });
  };

  const formatMonth = (month: any) => {
    const now = dayjs();
    if (month.year() === now.year()) {
      return (
        month.format("MMMM").charAt(0).toUpperCase() +
        month.format("MMMM").slice(1)
      );
    } else {
      return (
        month.format("MMM. YY").charAt(0).toUpperCase() +
        month.format("MMM. YY").slice(1)
      );
    }
  };

  const previousMonth = currentMonth.subtract(1, "month");
  const nextMonth = currentMonth.add(1, "month");

  return (
    <View
      style={{
        backgroundColor: colors.primaryContainer,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          marginVertical: 5,
        }}
      >
        {title && (
          <>
            <BytebankText
              variant="titleMedium"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {title}
            </BytebankText>
          </>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={{ opacity: isCurrentMonth ? 0 : 1 }}
            disabled={isCurrentMonth}
            onPress={getCurrentDate}
          >
            <AntDesign name="calendar" size={24} color={colors.onBackground} />
          </TouchableOpacity>

          {onPressDotsButton && (
            <TouchableOpacity onPress={onPressDotsButton}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={26}
                color={colors.onBackground}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={24} color={colors.onBackground} />
        </TouchableOpacity>

        <View style={styles.monthContainer}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <BytebankText style={[styles.monthText, { color: colors.outline }]}>
              {formatMonth(previousMonth)}
            </BytebankText>
          </TouchableOpacity>
          <BytebankText
            style={[
              styles.monthText,
              styles.activeMonth,
              { color: colors.onBackground },
              {
                backgroundColor: colors.backdrop,
                padding: 8,
                borderRadius: 6,
              },
            ]}
          >
            {formatMonth(currentMonth)}
          </BytebankText>
          <TouchableOpacity onPress={goToNextMonth}>
            <BytebankText style={[styles.monthText, { color: colors.outline }]}>
              {formatMonth(nextMonth)}
            </BytebankText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.onBackground}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  monthText: {
    fontSize: 16,
  },
  activeMonth: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
