import { getTransactionsByMonth } from "@/services/firestore";
import { BytebankText, Container, MonthNavigator } from "@/src/core/components";
import { Transaction } from "@core/types/services";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import { NoTransactions } from "./no-transactions";
import { TransactionItem } from "./transaction-item";

export default function TransactionScreen() {
  const { colors } = useTheme();
  const { user } = useAppStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [initialLoad, setInitialLoad] = useState(false);

  const loadTransactions = async (month: dayjs.Dayjs) => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const year = month.year();
      const monthNumber = month.month() + 1;

      const transactionsData = await getTransactionsByMonth(
        user.uid,
        year,
        monthNumber,
      );
      setTransactions(transactionsData as Transaction[]);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month: dayjs.Dayjs) => {
    setCurrentMonth(month);
    loadTransactions(month);
  };

  useEffect(() => {
    if (!initialLoad && user?.uid) {
      setInitialLoad(true);
      loadTransactions(currentMonth);
    }
  }, [user?.uid, initialLoad]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onUpdate={() => loadTransactions(currentMonth)}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <MonthNavigator title="Transações" onMonthChange={handleMonthChange} />
      <Container scrollable={false}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <BytebankText style={{ color: colors.onBackground, marginTop: 16 }}>
              Carregando transações...
            </BytebankText>
          </View>
        ) : transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoTransactions />
        )}
      </Container>
    </View>
  );
}
