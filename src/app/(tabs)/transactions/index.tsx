import { getTransactionsByMonth } from "@/services/firestore";
import { BytebankText, Container, MonthNavigator } from "@/src/core/components";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

interface Transaction {
  id: string;
  valor: string;
  descricao?: string;
  type: "expense" | "income";
  paymentMethod: string;
  category: {
    id: string;
    name: string;
    isCustom: boolean;
  };
  date: Date;
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const { colors } = useTheme();
  const isExpense = transaction.type === "expense";

  return (
    <TouchableOpacity
      style={[styles.transactionItem, { backgroundColor: colors.surface }]}
    >
      <View style={styles.transactionContent}>
        <View style={styles.transactionInfo}>
          <BytebankText
            style={[styles.transactionDescription, { color: colors.onSurface }]}
          >
            {transaction.descricao || transaction.category.name}
          </BytebankText>
          <BytebankText
            style={[
              styles.transactionCategory,
              { color: colors.onSurfaceVariant },
            ]}
          >
            {transaction.category.name}
          </BytebankText>
          <BytebankText
            style={[styles.transactionDate, { color: colors.onSurfaceVariant }]}
          >
            {dayjs(transaction.date).format("DD/MM/YYYY")}
          </BytebankText>
        </View>
        <View style={styles.transactionValue}>
          <BytebankText
            style={[
              styles.valueText,
              { color: isExpense ? colors.error : colors.primary },
            ]}
          >
            {isExpense ? "-" : "+"}R${" "}
            {parseFloat(transaction.valor).toFixed(2).replace(".", ",")}
          </BytebankText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NoTransactions = () => {
  const { colors } = useTheme();
  return (
    <View>
      <BytebankText
        style={{
          textAlign: "center",
          fontWeight: "bold",
          maxWidth: 250,
          margin: "auto",
        }}
        variant="headlineSmall"
      >
        Nenhum lançamento neste mês
      </BytebankText>
      <BytebankText
        style={{
          marginTop: 16,
          textAlign: "center",
          maxWidth: 200,
          margin: "auto",
          color: colors.outline,
        }}
      >
        Toque em + para adicionar um lançamento
      </BytebankText>
    </View>
  );
};

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
      const monthNumber = month.month() + 1; // dayjs usa 0-11, precisamos 1-12

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
    <TransactionItem transaction={item} />
  );

  return (
    <View style={{ flex: 1 }}>
      <MonthNavigator title="Transações" onMonthChange={handleMonthChange} />
      <Container scrollable={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
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
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <NoTransactions />
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  listContainer: {
    padding: 16,
  },
  transactionItem: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionValue: {
    alignItems: "flex-end",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
