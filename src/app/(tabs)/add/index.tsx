import { useAuth } from "@/contexts/AuthContext";
import {
  addTransactionAndUpdateBalance,
  getCombinedCategories,
  getPaymentMethods,
} from "@/services/firestore";
import {
  BytebankCard,
  BytebankText,
  BytebankTouchableRipple,
} from "@/src/core/components";
import { useBottomSheet } from "@/src/core/hooks";
import { staticColors } from "@/src/core/theme/theme";
import { Category } from "@/types/services/categories/categoryTypes";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

function formatarMoedaBR(valor: string) {
  const numero = valor.replace(/\D/g, "");
  if (!numero) return "0,00";
  const numeroComCentavos = (parseInt(numero, 10) / 100).toFixed(2);
  const [inteiro, decimal] = numeroComCentavos.split(".");
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${inteiroFormatado},${decimal}`;
}

function formatarData(data: Date | undefined): string {
  if (!data) return "Selecione uma data";
  return data.toLocaleDateString("pt-BR");
}

const Tab = createMaterialTopTabNavigator();

function TransactionForm({ type }: { type: "expense" | "income" }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { closeBottomSheet } = useBottomSheet();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
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

  const [date, setDate] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Watch dos campos para atualizar a UI
  const watchedPaymentMethod = watch("paymentMethod");
  const watchedCategory = watch("category");
  const watchedDate = watch("date");

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: { date: any }) => {
      setOpen(false);
      setDate(params.date);
      // Atualizar o valor no formulário
      setValue("date", params.date);
    },
    [setOpen, setDate, setValue],
  );

  const inputRef = React.useRef<any>(null);

  // Busca dados do Firebase quando o componente monta ou o tipo muda
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);

        // Busca categorias baseadas no tipo
        const categoryType = type === "expense" ? "expense" : "income";
        const categoriesResult = await getCombinedCategories(
          user.uid,
          categoryType,
        );
        setCategories(categoriesResult.categories);

        // Busca métodos de pagamento baseados no tipo
        const methods = await getPaymentMethods(categoryType);
        setPaymentMethods(methods);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid, type]);

  const onSubmit = async (data: any) => {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // A validação agora é feita automaticamente pelo React Hook Form

    setIsSubmitting(true);

    try {
      const valorNumerico = parseFloat(
        data.value.replace(/\./g, "").replace(",", "."),
      );

      const transactionData = {
        valor: valorNumerico.toString(),
        type: data.type,
        paymentMethod: data.paymentMethod,
        category: data.category,
        date: data.date,
      };
      console.log(transactionData);

      const transactionId = await addTransactionAndUpdateBalance(
        user.uid,
        transactionData,
      );

      console.log("Transação salva com sucesso:", transactionId);

      Alert.alert(
        "Sucesso",
        `Transação de ${
          type === "expense" ? "despesa" : "receita"
        } salva com sucesso!`,
        [
          {
            text: "OK",
            onPress: () => {
              // Limpar formulário
              setDate(undefined);
              // Resetar formulário do react-hook-form
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
            },
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar a transação. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza loading ou error se necessário
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
            // Recarregar dados
            const fetchData = async () => {
              if (!user?.uid) return;
              try {
                const categoryType = type === "expense" ? "expense" : "income";
                const categoriesResult = await getCombinedCategories(
                  user.uid,
                  categoryType,
                );
                setCategories(categoriesResult.categories);
                const methods = await getPaymentMethods(categoryType);
                setPaymentMethods(methods);
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
              }}
            >
              <TouchableOpacity onPress={() => inputRef.current?.focus()}>
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
                onChangeText={(e) => onChange(formatarMoedaBR(e))}
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

        <BytebankTouchableRipple
          style={{ borderTopWidth: 1 }}
          placeholder={watchedPaymentMethod || "Selecione método de pagamento"}
          icon={
            <Feather name="dollar-sign" size={26} color={colors.onBackground} />
          }
          onClose={closeBottomSheet}
        >
          <BytebankText
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: 16 }}
          >
            Selecione um método de pagamento:
          </BytebankText>
          <FlatList
            data={paymentMethods}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  // Atualizar o valor no formulário
                  setValue("paymentMethod", item);
                  closeBottomSheet();
                  console.log("Método de pagamento selecionado:", item);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor:
                    watchedPaymentMethod === item
                      ? colors.primaryContainer
                      : colors.surface,
                  marginBottom: 8,
                  borderWidth: watchedPaymentMethod === item ? 1 : 0,
                  borderColor:
                    watchedPaymentMethod === item
                      ? colors.primary
                      : "transparent",
                }}
              >
                <View>
                  <BytebankText
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color:
                        watchedPaymentMethod === item
                          ? colors.primary
                          : colors.onSurface,
                    }}
                  >
                    {item}
                  </BytebankText>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <BytebankText
                style={{
                  textAlign: "center",
                  color: colors.onSurfaceVariant,
                  marginTop: 16,
                }}
              >
                Nenhum método de pagamento disponível
              </BytebankText>
            )}
          />
        </BytebankTouchableRipple>

        <BytebankTouchableRipple
          placeholder={watchedCategory?.name || "Selecione categoria"}
          icon={
            <MaterialIcons
              name="category"
              size={26}
              color={colors.onBackground}
            />
          }
          onClose={closeBottomSheet}
        >
          <BytebankText
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: 16 }}
          >
            Selecione uma categoria:
          </BytebankText>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setValue("category", {
                    id: item.id,
                    name: item.name,
                    isCustom: item.isCustom,
                  });
                  setValue("category.id", item.id);
                  closeBottomSheet();
                  console.log("Categoria selecionada:", item.name);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor:
                    watchedCategory?.id === item.id
                      ? colors.primaryContainer
                      : colors.surface,
                  marginBottom: 8,
                  borderWidth: watchedCategory?.id === item.id ? 1 : 0,
                  borderColor:
                    watchedCategory?.id === item.id
                      ? colors.primary
                      : "transparent",
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
                      fontSize: 16,
                      fontWeight: "500",
                      color:
                        watchedCategory?.id === item.id
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
            ListEmptyComponent={() => (
              <BytebankText
                style={{
                  textAlign: "center",
                  color: colors.onSurfaceVariant,
                  marginTop: 16,
                }}
              >
                Nenhuma categoria disponível
              </BytebankText>
            )}
          />
        </BytebankTouchableRipple>

        <BytebankTouchableRipple
          placeholder={formatarData(watchedDate)}
          onPress={() => setOpen(true)}
          error={errors.date?.message}
          icon={
            <Feather name="calendar" size={26} color={colors.onBackground} />
          }
        ></BytebankTouchableRipple>
        <DatePickerModal
          locale="pt"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
        />

        {/* Controllers invisíveis para validação */}
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

        <BytebankTouchableRipple
          placeholder="Anexar arquivo"
          icon={
            <AntDesign name="file-add" size={26} color={colors.onBackground} />
          }
          onClose={closeBottomSheet}
        ></BytebankTouchableRipple>

        {/* Exibição de erros de validação */}
        {Object.keys(errors).length > 0 && (
          <View style={{ marginBottom: 16, marginHorizontal: "auto" }}>
            {errors.value && (
              <BytebankText
                style={{ color: colors.error, fontSize: 12, marginBottom: 4 }}
              >
                {errors.value.message}
              </BytebankText>
            )}
            {errors.paymentMethod && (
              <BytebankText
                style={{ color: colors.error, fontSize: 12, marginBottom: 4 }}
              >
                {errors.paymentMethod.message}
              </BytebankText>
            )}
            {errors.category && (
              <BytebankText
                style={{ color: colors.error, fontSize: 12, marginBottom: 4 }}
              >
                {errors.category.message}
              </BytebankText>
            )}
            {errors.date && (
              <BytebankText
                style={{ color: colors.error, fontSize: 12, marginBottom: 4 }}
              >
                {errors.date.message}
              </BytebankText>
            )}
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
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

export default function AddScreen() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "white" : "black",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", marginTop: 28 },
        tabBarIndicatorStyle: {
          backgroundColor: colorScheme === "dark" ? "white" : "black",
        },
        tabBarStyle: { backgroundColor: colors.primaryContainer },
      }}
    >
      <Tab.Screen name="Despesa">
        {() => <TransactionForm type="expense" />}
      </Tab.Screen>
      <Tab.Screen name="Receita">
        {() => <TransactionForm type="income" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  saveBtn: {
    marginTop: "auto",
    borderRadius: 50,
  },
});
