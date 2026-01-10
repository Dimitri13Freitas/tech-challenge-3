import { BytebankCard, BytebankText } from "@/src/core/components";
import { useGlobalBottomSheet, useSnackbar } from "@core/hooks";
import { staticColors } from "@core/theme/theme";
import { Category } from "@core/types/services/categories/categoryTypes";
import { PaymentMethod } from "@core/types/services/paymentMethods/paymentMethodsTypes";
import { formatCurrencyBR } from "@core/utils";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { domainCategoriesToLegacy } from "@infrastructure/adapters/domainAdapters";
import {
  addTransactionUseCase,
  fetchCategoriesUseCase,
  paymentMethodRepository,
} from "@infrastructure/di/useCases";
import { useAppStore } from "@store/useAppStore";
import { useFocusEffect } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CategorySelectorSheet } from "./category-selector-sheet";
import { PaymentMethodSelectorSheet } from "./payment-method-selector-sheet";

function formatarData(data: Date | undefined): string {
  if (!data) return "Selecione uma data";
  return data.toLocaleDateString("pt-BR");
}

export function TransactionForm({ type }: { type: "expense" | "income" }) {
  const { colors } = useTheme();
  const { user } = useAppStore();
  const { open } = useGlobalBottomSheet();
  const { showMessage } = useSnackbar();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      value: "",
      type: type,
      paymentMethod: "",
      category: {
        id: "",
        name: "",
        isCustom: false,
      },
      date: undefined as Date | undefined,
      userId: user?.uid || "",
    },
  });

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(
    [],
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const watchedPaymentMethod = watch("paymentMethod");
  const watchedCategory = watch("category");
  const watchedDate = watch("date");

  const onDismissSingle = React.useCallback(() => {
    setDatePickerOpen(false);
  }, []);

  const onConfirmSingle = React.useCallback(
    (params: { date: any }) => {
      setDatePickerOpen(false);
      setDate(params.date);
      setValue("date", params.date);
    },
    [setValue],
  );

  const inputRef = React.useRef<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!user?.uid) return;

        try {
          setLoading(true);
          setError(null);

          const categoryType = type === "expense" ? "expense" : "income";
          const categoriesResult = await fetchCategoriesUseCase.execute({
            userId: user.uid,
            type: categoryType,
            pageSize: 1000,
          });
          const legacyCategories = domainCategoriesToLegacy(
            categoriesResult.categories,
          );
          setCategories(legacyCategories);

          const domainMethods =
            await paymentMethodRepository.getPaymentMethodsByType(categoryType);
          const legacyMethods: PaymentMethod[] = domainMethods.map((method) => ({
            id: method.id,
            name: method.name,
            type: method.type,
          }));
          setPaymentMethods(legacyMethods);
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
          setError("Erro ao carregar dados. Tente novamente.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [user?.uid, type])
  );

  const onSubmit = async (data: any) => {
    if (!user?.uid) {
      showMessage("Usuário não autenticado.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const valorNumerico = parseFloat(
        data.value.replace(/\./g, "").replace(",", "."),
      );

      await addTransactionUseCase.execute({
        userId: user.uid,
        valor: valorNumerico,
        type: data.type,
        paymentMethod: data.paymentMethod,
        category: data.category,
        date: data.date,
      });

      showMessage(
        `Transação de ${
          type === "expense" ? "despesa" : "receita"
        } salva com sucesso!`,
        "success",
      );

      setDate(undefined);
      reset({
        value: "",
        type: type,
        paymentMethod: "",
        category: {
          id: "",
          name: "",
          isCustom: false,
        },
        date: undefined,
        userId: user?.uid || "",
      });
    } catch (error: any) {
      console.error("Erro ao salvar transação:", error);
      showMessage(
        error?.message ||
          "Não foi possível salvar a transação. Tente novamente.",
        "warning",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCategorySelector = () => {
    open({
      snapPoints: ["70%"],
      enableScroll: false,
      content: (
        <CategorySelectorSheet
          categories={categories}
          selectedCategoryId={watchedCategory?.id}
          onSelect={(category) => {
            setValue("category", {
              id: category.id,
              name: category.name,
              isCustom: category.isCustom,
            });
          }}
        />
      ),
    });
  };

  const handleOpenPaymentMethodSelector = () => {
    open({
      snapPoints: ["70%"],
      enableScroll: false,
      content: (
        <PaymentMethodSelectorSheet
          paymentMethods={paymentMethods}
          selectedPaymentMethod={watchedPaymentMethod}
          onSelect={(method) => {
            setValue("paymentMethod", method);
          }}
        />
      ),
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          padding: 16,
        }}
      >
        <BytebankText
          style={{ color: colors.error, textAlign: "center", marginBottom: 16 }}
        >
          {error}
        </BytebankText>
        <Button
          mode="contained"
          onPress={() => {
            setError(null);
            setLoading(true);
            const fetchData = async () => {
              if (!user?.uid) return;
              try {
                const categoryType = type === "expense" ? "expense" : "income";
                const categoriesResult = await fetchCategoriesUseCase.execute({
                  userId: user.uid,
                  type: categoryType,
                  pageSize: 1000,
                });
                const legacyCategories = domainCategoriesToLegacy(
                  categoriesResult.categories,
                );
                setCategories(legacyCategories);
                const domainMethods =
                  await paymentMethodRepository.getPaymentMethodsByType(
                    categoryType,
                  );
                const legacyMethods: PaymentMethod[] = domainMethods.map(
                  (method) => ({
                    id: method.id,
                    name: method.name,
                    type: method.type,
                  }),
                );
                setPaymentMethods(legacyMethods);
              } catch {
                setError("Erro ao carregar dados. Tente novamente.");
              } finally {
                setLoading(false);
              }
            };
            fetchData();
          }}
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, flex: 1 }}>
        <Controller
          control={control}
          name="value"
          rules={{
            required: "Valor é obrigatório",
            validate: (value) => {
              if (!value || value === "0,00") {
                return "Por favor, informe um valor válido.";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <BytebankCard
              style={{
                backgroundColor:
                  type === "expense"
                    ? staticColors.expense
                    : staticColors.income,
                paddingVertical: 12,
                marginBottom: 16,
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
                  <BytebankText style={styles.amountText}>R$</BytebankText>
                  <BytebankText style={styles.amountText}>
                    {value || "0,00"}
                  </BytebankText>
                </View>
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                value={value}
                keyboardType="numeric"
                onChangeText={(e) =>
                  onChange(
                    formatCurrencyBR(e, {
                      cleanString: true,
                      removeSymbol: true,
                    }),
                  )
                }
                style={{
                  height: 0,
                  width: 0,
                  position: "absolute",
                  opacity: 0,
                }}
              />
            </BytebankCard>
          )}
        />

        <TouchableOpacity
          onPress={handleOpenPaymentMethodSelector}
          style={{
            borderColor: colors.surfaceVariant,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              borderRadius: 100,
              backgroundColor: colors.elevation.level5,
              padding: 8,
              borderWidth: 1,
              borderColor: colors.surfaceVariant,
            }}
          >
            <Feather name="dollar-sign" size={26} color={colors.onBackground} />
          </View>
          <BytebankText variant="titleMedium" style={{ color: colors.outline }}>
            {watchedPaymentMethod || "Selecione método de pagamento"}
          </BytebankText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenCategorySelector}
          style={{
            borderColor: colors.surfaceVariant,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              borderRadius: 100,
              backgroundColor: colors.elevation.level5,
              padding: 8,
              borderWidth: 1,
              borderColor: colors.surfaceVariant,
            }}
          >
            <MaterialIcons
              name="category"
              size={26}
              color={colors.onBackground}
            />
          </View>
          <BytebankText variant="titleMedium" style={{ color: colors.outline }}>
            {watchedCategory?.name || "Selecione categoria"}
          </BytebankText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDatePickerOpen(true)}
          style={{
            borderColor: colors.surfaceVariant,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              borderRadius: 100,
              backgroundColor: colors.elevation.level5,
              padding: 8,
              borderWidth: 1,
              borderColor: colors.surfaceVariant,
            }}
          >
            <Feather name="calendar" size={26} color={colors.onBackground} />
          </View>
          <BytebankText variant="titleMedium" style={{ color: colors.outline }}>
            {formatarData(watchedDate)}
          </BytebankText>
        </TouchableOpacity>

        <DatePickerModal
          locale="pt"
          mode="single"
          visible={datePickerOpen}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
        />

        <Controller
          control={control}
          name="paymentMethod"
          rules={{ required: "Método de pagamento é obrigatório" }}
          render={() => <View style={{ display: "none" }} />}
        />
        <Controller
          control={control}
          name="category"
          rules={{ required: "Categoria é obrigatória" }}
          render={() => <View style={{ display: "none" }} />}
        />
        <Controller
          control={control}
          name="date"
          rules={{ required: "Data é obrigatória" }}
          render={() => <View style={{ display: "none" }} />}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit, (validationErrors) => {
            const firstError = Object.values(validationErrors)[0] as any;
            if (firstError?.message) {
              showMessage(firstError.message, "warning");
            } else {
              showMessage(
                "Por favor, preencha todos os campos obrigatórios.",
                "warning",
              );
            }
          })}
          style={styles.saveBtn}
          buttonColor={colors.primary}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  saveBtn: {
    marginTop: "auto",
    borderRadius: 50,
  },
});
