import { BytebankButton, BytebankText } from "@core/components";
import { useGlobalBottomSheet } from "@core/hooks";
import { AntDesign } from "@expo/vector-icons";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Dialog, Portal, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export interface TransactionFilters {
  type?: "expense" | "income" | "all";
  categoryId?: string;
  paymentMethod?: string;
  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
}

interface TransactionFiltersSheetProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

export const TransactionFiltersSheet = ({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: TransactionFiltersSheetProps) => {
  const { colors } = useTheme();
  const { close } = useGlobalBottomSheet();
  const {
    user,
    categories,
    fetchCategories,
    paymentMethods,
    fetchPaymentMethods,
  } = useAppStore();

  const [type, setType] = useState<"expense" | "income" | "all">(
    filters.type || "all",
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    filters.categoryId,
  );
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    filters.paymentMethod,
  );
  const [minValue, setMinValue] = useState<string>(
    filters.minValue?.toString() || "",
  );
  const [maxValue, setMaxValue] = useState<string>(
    filters.maxValue?.toString() || "",
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [paymentMethodDialogVisible, setPaymentMethodDialogVisible] =
    useState(false);

  // Carrega categorias e métodos de pagamento
  useEffect(() => {
    if (user?.uid && type !== "all") {
      fetchCategories(user.uid, type, { reset: true, pageSize: 1000 });
    } else if (user?.uid) {
      fetchCategories(user.uid, undefined, { reset: true, pageSize: 1000 });
    }
  }, [type, user?.uid]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Filtra categorias e métodos pelo tipo
  const filteredCategories = useMemo(() => {
    if (type === "all") {
      return categories;
    }
    return categories.filter((cat) => cat.type === type);
  }, [categories, type]);

  const filteredPaymentMethods = useMemo(() => {
    if (type === "all") {
      return paymentMethods;
    }
    return paymentMethods.filter((pm) => pm.type === type);
  }, [paymentMethods, type]);

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === categoryId),
    [categories, categoryId],
  );

  const hasActiveFilters = useMemo(() => {
    return (
      type !== "all" ||
      !!categoryId ||
      !!paymentMethod ||
      !!minValue ||
      !!maxValue ||
      !!startDate ||
      !!endDate
    );
  }, [type, categoryId, paymentMethod, minValue, maxValue, startDate, endDate]);

  const handleApply = () => {
    const newFilters: TransactionFilters = {
      type: type === "all" ? undefined : type,
      categoryId,
      paymentMethod,
      minValue: minValue ? parseFloat(minValue) : undefined,
      maxValue: maxValue ? parseFloat(maxValue) : undefined,
      startDate,
      endDate,
    };
    onFiltersChange(newFilters);
    onApply();
    close();
  };

  const handleClear = () => {
    setType("all");
    setCategoryId(undefined);
    setPaymentMethod(undefined);
    setMinValue("");
    setMaxValue("");
    setStartDate(undefined);
    setEndDate(undefined);
    onClear();
  };

  const onConfirmStartDate = React.useCallback((params: { date: any }) => {
    setStartDatePickerVisible(false);
    setStartDate(params.date);
  }, []);

  const onConfirmEndDate = React.useCallback((params: { date: any }) => {
    setEndDatePickerVisible(false);
    setEndDate(params.date);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BytebankText
        variant="titleLarge"
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Filtros Avançados
      </BytebankText>

      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 8 }}>
          Tipo de transação
        </BytebankText>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setType("all");
              setCategoryId(undefined);
              setPaymentMethod(undefined);
            }}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor:
                type === "all" ? colors.primaryContainer : colors.backdrop,
              alignItems: "center",
            }}
          >
            <BytebankText
              style={{
                fontWeight: type === "all" ? "bold" : "normal",
                color: type === "all" ? colors.primary : colors.onSurface,
              }}
            >
              Todas
            </BytebankText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType("expense");
            }}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor:
                type === "expense" ? colors.primaryContainer : colors.backdrop,
              alignItems: "center",
            }}
          >
            <BytebankText
              style={{
                fontWeight: type === "expense" ? "bold" : "normal",
                color: type === "expense" ? colors.primary : colors.onSurface,
              }}
            >
              Despesas
            </BytebankText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType("income");
            }}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor:
                type === "income" ? colors.primaryContainer : colors.backdrop,
              alignItems: "center",
            }}
          >
            <BytebankText
              style={{
                fontWeight: type === "income" ? "bold" : "normal",
                color: type === "income" ? colors.primary : colors.onSurface,
              }}
            >
              Receitas
            </BytebankText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categoria */}
      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 4 }}>
          Categoria
        </BytebankText>
        <TouchableOpacity
          style={{
            backgroundColor: colors.backdrop,
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => setCategoryDialogVisible(true)}
        >
          <BytebankText variant="bodyLarge">
            {selectedCategory?.name || "Todas as categorias"}
          </BytebankText>
          <AntDesign name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Forma de pagamento */}
      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 4 }}>
          Forma de pagamento
        </BytebankText>
        <TouchableOpacity
          style={{
            backgroundColor: colors.backdrop,
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => setPaymentMethodDialogVisible(true)}
        >
          <BytebankText variant="bodyLarge">
            {paymentMethod || "Todas as formas"}
          </BytebankText>
          <AntDesign name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Valor mínimo e máximo */}
      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 8 }}>
          Valor
        </BytebankText>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              label="Valor mínimo"
              value={minValue}
              onChangeText={setMinValue}
              keyboardType="numeric"
              mode="outlined"
              style={{ backgroundColor: colors.surface }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Valor máximo"
              value={maxValue}
              onChangeText={setMaxValue}
              keyboardType="numeric"
              mode="outlined"
              style={{ backgroundColor: colors.surface }}
            />
          </View>
        </View>
      </View>

      {/* Período */}
      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 8 }}>
          Período
        </BytebankText>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.backdrop,
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => setStartDatePickerVisible(true)}
          >
            <BytebankText variant="bodySmall" style={{ marginBottom: 4 }}>
              Data inicial
            </BytebankText>
            <BytebankText variant="bodyLarge">
              {startDate ? dayjs(startDate).format("DD/MM/YYYY") : "Selecione"}
            </BytebankText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.backdrop,
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => setEndDatePickerVisible(true)}
          >
            <BytebankText variant="bodySmall" style={{ marginBottom: 4 }}>
              Data final
            </BytebankText>
            <BytebankText variant="bodyLarge">
              {endDate ? dayjs(endDate).format("DD/MM/YYYY") : "Selecione"}
            </BytebankText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: "auto",
        }}
      >
        <BytebankButton
          mode="outlined"
          style={{ flex: 1 }}
          onPress={handleClear}
          disabled={!hasActiveFilters}
        >
          Limpar
        </BytebankButton>
        <BytebankButton
          mode="contained"
          style={{ flex: 1 }}
          onPress={handleApply}
        >
          Aplicar
        </BytebankButton>
      </View>

      {/* Diálogo de Categorias */}
      <Portal>
        <Dialog
          visible={categoryDialogVisible}
          onDismiss={() => setCategoryDialogVisible(false)}
        >
          <Dialog.Title>Selecione uma categoria</Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              onPress={() => {
                setCategoryId(undefined);
                setCategoryDialogVisible(false);
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: !categoryId
                  ? colors.primaryContainer
                  : "transparent",
                marginBottom: 8,
              }}
            >
              <BytebankText
                style={{
                  fontWeight: !categoryId ? "bold" : "normal",
                  color: !categoryId ? colors.primary : colors.onSurface,
                }}
              >
                Todas as categorias
              </BytebankText>
            </TouchableOpacity>
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCategoryId(item.id);
                    setCategoryDialogVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor:
                      categoryId === item.id
                        ? colors.primaryContainer
                        : "transparent",
                    marginBottom: 8,
                  }}
                >
                  <BytebankText
                    style={{
                      fontWeight: categoryId === item.id ? "bold" : "normal",
                      color:
                        categoryId === item.id
                          ? colors.primary
                          : colors.onSurface,
                    }}
                  >
                    {item.name}
                  </BytebankText>
                </TouchableOpacity>
              )}
            />
          </Dialog.Content>
        </Dialog>

        {/* Diálogo de Forma de Pagamento */}
        <Dialog
          visible={paymentMethodDialogVisible}
          onDismiss={() => setPaymentMethodDialogVisible(false)}
        >
          <Dialog.Title>Selecione a forma de pagamento</Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              onPress={() => {
                setPaymentMethod(undefined);
                setPaymentMethodDialogVisible(false);
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: !paymentMethod
                  ? colors.primaryContainer
                  : "transparent",
                marginBottom: 8,
              }}
            >
              <BytebankText
                style={{
                  fontWeight: !paymentMethod ? "bold" : "normal",
                  color: !paymentMethod ? colors.primary : colors.onSurface,
                }}
              >
                Todas as formas
              </BytebankText>
            </TouchableOpacity>
            <FlatList
              data={filteredPaymentMethods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod(item.name);
                    setPaymentMethodDialogVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor:
                      paymentMethod === item.name
                        ? colors.primaryContainer
                        : "transparent",
                    marginBottom: 8,
                  }}
                >
                  <BytebankText
                    style={{
                      fontWeight:
                        paymentMethod === item.name ? "bold" : "normal",
                      color:
                        paymentMethod === item.name
                          ? colors.primary
                          : colors.onSurface,
                    }}
                  >
                    {item.name}
                  </BytebankText>
                </TouchableOpacity>
              )}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* DatePickerModals */}
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={startDatePickerVisible}
        onDismiss={() => setStartDatePickerVisible(false)}
        date={startDate}
        onConfirm={onConfirmStartDate}
      />
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={endDatePickerVisible}
        onDismiss={() => setEndDatePickerVisible(false)}
        date={endDate}
        onConfirm={onConfirmEndDate}
      />
    </View>
  );
};
