import {
  BytebankBarChart,
  BytebankPieChart,
  Container,
  MonthNavigator,
} from "@/src/core/components";
import {
  CategoryExpenseData,
  getExpensesByCategory,
  getMonthlySummary,
} from "@core/api/firestore/reports";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { user } = useAppStore();

  const [expensesData, setExpensesData] = useState<CategoryExpenseData[]>([]);
  const [dataChart, setDataChart] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = async (date: dayjs.Dayjs) => {
    try {
      setIsLoading(true);
      const year = date.year();
      const month = date.month() + 1;
      const data = user
        ? await getExpensesByCategory(user?.uid, year, month)
        : null;
      const anotherData = user
        ? await getMonthlySummary(user?.uid, year, month)
        : null;
      console.log(anotherData);

      setDataChart(anotherData);
      if (data) setExpensesData(data);
    } catch (error) {
      console.error("Erro ao atualizar gráfico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MonthNavigator
        title="Resumo Financeiro"
        onMonthChange={fetchReportData}
      />
      <Container>
        {isLoading ? (
          <View
            style={{
              height: 300,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.onSurface, marginTop: 10 }}>
              Carregando dados...
            </Text>
          </View>
        ) : (
          <>
            <BytebankPieChart categories={expensesData} />
            <BytebankBarChart data={dataChart} />
          </>
        )}
      </Container>
    </>
  );
}
