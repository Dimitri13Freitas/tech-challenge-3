import { BytebankText, Container, MonthNavigator } from "@/src/core/components";
import { useGlobalBottomSheet } from "@core/hooks";
import { Transaction } from "@core/types/services";
import { getTransactionsByMonthUseCase } from "@infrastructure/di/useCases";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import { NoTransactions } from "./no-transactions";
import {
  TransactionFilters,
  TransactionFiltersSheet,
} from "./transaction-filters-sheet";
import { TransactionItem } from "./transaction-item";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function TransactionScreen() {
  const { colors } = useTheme();
  const { user } = useAppStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [initialLoad, setInitialLoad] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { open } = useGlobalBottomSheet();

  const loadTransactions = useCallback(
    async (month: dayjs.Dayjs) => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const year = month.year();
        const monthNumber = month.month() + 1;

        const transactionsData = await getTransactionsByMonthUseCase.execute({
          month: monthNumber,
          year,
          userId: user.uid,
        });
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid],
  );

  const applyFilters = useMemo(() => {
    return (transactionsToFilter: Transaction[]) => {
      let filtered = [...transactionsToFilter];

      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      if (filters.categoryId) {
        filtered = filtered.filter((t) => t.category.id === filters.categoryId);
      }

      if (filters.paymentMethod) {
        filtered = filtered.filter(
          (t) => t.paymentMethod === filters.paymentMethod,
        );
      }

      if (filters.minValue !== undefined) {
        filtered = filtered.filter(
          (t) => parseFloat(`${t.valor}`) >= filters.minValue!,
        );
      }

      if (filters.maxValue !== undefined) {
        filtered = filtered.filter(
          (t) => parseFloat(`${t.valor}`) <= filters.maxValue!,
        );
      }

      if (filters.startDate) {
        filtered = filtered.filter((t) => {
          let transactionDate: Date;
          if (t.date && typeof t.date === "object" && "seconds" in t.date) {
            transactionDate = new Date(
              (t.date as any).seconds * 1000 +
                ((t.date as any).nanoseconds || 0) / 1e6,
            );
          } else {
            transactionDate =
              t.date instanceof Date ? t.date : new Date(t.date);
          }
          return dayjs(transactionDate).isSameOrAfter(
            dayjs(filters.startDate).startOf("day"),
          );
        });
      }

      if (filters.endDate) {
        filtered = filtered.filter((t) => {
          let transactionDate: Date;
          if (t.date && typeof t.date === "object" && "seconds" in t.date) {
            transactionDate = new Date(
              (t.date as any).seconds * 1000 +
                ((t.date as any).nanoseconds || 0) / 1e6,
            );
          } else {
            transactionDate =
              t.date instanceof Date ? t.date : new Date(t.date);
          }
          return dayjs(transactionDate).isSameOrBefore(
            dayjs(filters.endDate).endOf("day"),
          );
        });
      }

      return filtered;
    };
  }, [filters]);

  useEffect(() => {
    const filtered = applyFilters(transactions);
    setFilteredTransactions(filtered);
  }, [transactions, applyFilters]);

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

  // Recarrega as transações quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      if (user?.uid && initialLoad) {
        loadTransactions(currentMonth);
      }
    }, [user?.uid, initialLoad, currentMonth, loadTransactions])
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onUpdate={() => loadTransactions(currentMonth)}
    />
  );

  function handleOpenSheet() {
    open({
      snapPoints: ["80%"],
      content: (
        <TransactionFiltersSheet
          filters={filters}
          onFiltersChange={setFilters}
          onApply={() => {
            // Os filtros já são aplicados automaticamente via useEffect
          }}
          onClear={() => {
            setFilters({});
          }}
        />
      ),
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <MonthNavigator
        title="Transações"
        onMonthChange={handleMonthChange}
        onPressDotsButton={handleOpenSheet}
      />
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
        ) : filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              Object.keys(filters).length > 0 ? (
                <View
                  style={{
                    padding: 12,
                    backgroundColor: colors.primaryContainer,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <BytebankText
                    variant="bodySmall"
                    style={{ color: colors.onPrimaryContainer }}
                  >
                    {filteredTransactions.length} transação(ões) encontrada(s)
                    com os filtros aplicados
                  </BytebankText>
                </View>
              ) : null
            }
          />
        ) : transactions.length > 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <BytebankText variant="titleMedium" style={{ marginBottom: 8 }}>
              Nenhuma transação encontrada
            </BytebankText>
            <BytebankText
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant, textAlign: "center" }}
            >
              Tente ajustar os filtros para encontrar mais resultados
            </BytebankText>
          </View>
        ) : (
          <NoTransactions />
        )}
      </Container>
    </View>
  );
}
