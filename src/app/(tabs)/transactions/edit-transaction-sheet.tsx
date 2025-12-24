import { updateTransactionAndBalance } from "@/services/firestore";
import { BytebankButton, BytebankCard, BytebankText } from "@core/components";
import { useGlobalBottomSheet, useSnackbar } from "@core/hooks";
import { staticColors } from "@core/theme/theme";
import { Category, Transaction } from "@core/types/services";
import {
  formatCurrencyBR,
  formatTransactionDate,
  transactionTimestampToDate,
} from "@core/utils";
import { AntDesign } from "@expo/vector-icons";
import { CategoryTabs } from "@features/index";
import { useAppStore } from "@store/useAppStore";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export const EditTransactionSheet = ({
  transaction,
  onUpdate,
}: {
  transaction: Transaction;
  onUpdate?: () => void;
}) => {
  const { colors } = useTheme();
  const { user } = useAppStore();
  const { close } = useGlobalBottomSheet();
  const { showMessage } = useSnackbar();
  const inputRef = useRef<any>(null);

  // Valores iniciais
  const initialType = transaction.type;
  const initialCategory = transaction.category;
  const initialPaymentMethod = transaction.paymentMethod;
  const initialDate = transactionTimestampToDate(transaction.date);
  const initialValue = parseFloat(transaction.valor)
    .toFixed(2)
    .replace(".", ",");

  // Estados editáveis
  const [type, setType] = useState<"expense" | "income">(initialType);
  const [category, setCategory] = useState(initialCategory);
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [date, setDate] = useState<Date>(initialDate);
  const [value, setValue] = useState(initialValue);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [paymentMethodDialogVisible, setPaymentMethodDialogVisible] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const {
    categories,
    fetchCategories,
    categoriesLoading,
    paymentMethods,
    fetchPaymentMethods,
    paymentMethodsLoading,
  } = useAppStore();

  // Reset valores quando a transação muda
  useEffect(() => {
    const newInitialDate = transactionTimestampToDate(transaction.date);
    setType(transaction.type);
    setCategory(transaction.category);
    setPaymentMethod(transaction.paymentMethod);
    setDate(newInitialDate);
    setValue(parseFloat(transaction.valor).toFixed(2).replace(".", ","));
  }, [transaction.id]);

  // Carrega categorias e métodos de pagamento quando o tipo muda
  useEffect(() => {
    if (user?.uid) {
      fetchCategories(user.uid, type, { reset: true, pageSize: 1000 });
    }
  }, [type, user?.uid]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Filtra categorias e métodos de pagamento pelo tipo
  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === type),
    [categories, type],
  );

  const filteredPaymentMethods = useMemo(
    () => paymentMethods.filter((pm) => pm.type === type),
    [paymentMethods, type],
  );

  // Verifica se houve alterações
  const hasChanges = useMemo(() => {
    const valueChanged =
      value !== initialValue ||
      parseFloat(value.replace(",", ".")) !== parseFloat(transaction.valor);
    const typeChanged = type !== initialType;
    const categoryChanged =
      category.id !== initialCategory.id ||
      category.name !== initialCategory.name;
    const paymentMethodChanged = paymentMethod !== initialPaymentMethod;
    const dateChanged =
      dayjs(date).format("DD/MM/YYYY") !==
      dayjs(initialDate).format("DD/MM/YYYY");

    return (
      valueChanged ||
      typeChanged ||
      categoryChanged ||
      paymentMethodChanged ||
      dateChanged
    );
  }, [
    value,
    type,
    category,
    paymentMethod,
    date,
    initialValue,
    initialType,
    initialCategory,
    initialPaymentMethod,
    initialDate,
    transaction.valor,
  ]);

  const handleSave = async () => {
    if (!user?.uid || !hasChanges) return;

    try {
      setSaving(true);

      const valorNumerico = parseFloat(value.replace(/\./g, "").replace(",", "."));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        Alert.alert("Erro", "Por favor, informe um valor válido.");
        return;
      }

      const oldData = {
        valor: transaction.valor,
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
        category: transaction.category,
        date: transaction.date,
      };

      const newData = {
        valor: valorNumerico.toString(),
        type: type,
        paymentMethod: paymentMethod,
        category: category,
        date: date,
      };

      await updateTransactionAndBalance(
        user.uid,
        transaction.id,
        oldData,
        newData,
      );

      showMessage("Transação atualizada com sucesso!", "success");
      close();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a transação.");
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDate = React.useCallback(
    (params: { date: any }) => {
      setCalendarVisible(false);
      setDate(params.date);
    },
    [],
  );
  return (
    <View>
      <BytebankText
        variant="titleLarge"
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Editar transação
      </BytebankText>
      <CategoryTabs value={type} onChange={setType} />

      <BytebankCard
        style={{
          backgroundColor:
            type === "expense" ? staticColors.expense : staticColors.income,
          paddingVertical: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            inputRef.current?.blur();
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BytebankText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              R$
            </BytebankText>
            <BytebankText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {value || "0,00"}
            </BytebankText>
          </View>
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={value}
          keyboardType="numeric"
          onChangeText={(e) => {
            const formatted = formatCurrencyBR(e, {
              cleanString: true,
              removeSymbol: true,
            });
            setValue(formatted);
          }}
          style={{
            height: 0,
            width: 0,
            position: "absolute",
            opacity: 0,
          }}
          caretHidden
          blurOnSubmit={false}
        />
      </BytebankCard>

      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="titleMedium" style={{ marginBottom: 4 }}>
          Categoria
        </BytebankText>
        <TouchableOpacity
          style={{
            backgroundColor: colors.backdrop,
            padding: 8,
            display: "flex",
            flexDirection: "row",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => setCategoryDialogVisible(true)}
        >
          <BytebankText variant="bodyLarge" style={{ fontWeight: "regular" }}>
            {category.name}
          </BytebankText>
          <AntDesign name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Portal>
          <Dialog
            visible={categoryDialogVisible}
            onDismiss={() => setCategoryDialogVisible(false)}
          >
            <Dialog.Title>Selecione uma categoria</Dialog.Title>
            <Dialog.Content>
              {categoriesLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <FlatList
                  data={filteredCategories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCategory({
                          id: item.id,
                          name: item.name,
                          isCustom: item.isCustom,
                        });
                        setCategoryDialogVisible(false);
                      }}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor:
                          category.id === item.id
                            ? colors.primaryContainer
                            : "transparent",
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <BytebankText
                          style={{
                            fontWeight: category.id === item.id ? "bold" : "normal",
                            color:
                              category.id === item.id
                                ? colors.primary
                                : colors.onSurface,
                          }}
                        >
                          {item.name}
                        </BytebankText>
                        {item.isCustom && (
                          <BytebankText
                            style={{
                              fontSize: 10,
                              color: colors.primary,
                              backgroundColor: colors.primaryContainer,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 10,
                            }}
                          >
                            PERSONALIZADA
                          </BytebankText>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>

      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="titleMedium" style={{ marginBottom: 4 }}>
          Forma de pagamento
        </BytebankText>
        <TouchableOpacity
          style={{
            backgroundColor: colors.backdrop,
            padding: 8,
            display: "flex",
            flexDirection: "row",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => setPaymentMethodDialogVisible(true)}
        >
          <BytebankText variant="bodyLarge">{paymentMethod}</BytebankText>
          <AntDesign name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Portal>
          <Dialog
            visible={paymentMethodDialogVisible}
            onDismiss={() => setPaymentMethodDialogVisible(false)}
          >
            <Dialog.Title>Selecione a forma de pagamento</Dialog.Title>
            <Dialog.Content>
              {paymentMethodsLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
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
              )}
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>

      <View style={{ marginBottom: 16 }}>
        <BytebankText variant="labelLarge" style={{ marginBottom: 4 }}>
          Data
        </BytebankText>
        <TouchableOpacity
          style={{
            backgroundColor: colors.backdrop,
            padding: 8,
            display: "flex",
            flexDirection: "row",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => setCalendarVisible(true)}
        >
          <BytebankText variant="bodyLarge">
            {dayjs(date).format("DD/MM/YYYY")}
          </BytebankText>
          <AntDesign name="calendar" size={20} color={colors.primary} />
        </TouchableOpacity>
        <DatePickerModal
          locale="pt"
          mode="single"
          visible={calendarVisible}
          onDismiss={() => setCalendarVisible(false)}
          date={date}
          onConfirm={onConfirmDate}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto",
        }}
      >
        <BytebankButton
          mode="outlined"
          textColor={colors.error}
          style={{ flex: 1, marginRight: 8 }}
          onPress={() => {
            // deletar transação
          }}
        >
          Excluir
        </BytebankButton>

        <BytebankButton
          mode="contained"
          disabled={!hasChanges || saving}
          loading={saving}
          style={{ flex: 1, marginLeft: 8 }}
          onPress={handleSave}
        >
          Salvar
        </BytebankButton>
      </View>
    </View>
  );
};
