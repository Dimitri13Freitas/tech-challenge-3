import { BytebankCard } from "@/components/ui/card/card";
import { BytebankText } from "@/components/ui/text/text";
import { BytebankTouchableRipple } from "@/components/ui/touchable-ripple/touchable-ripple";
import { staticColors } from "@/constants/theme";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { Feather } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";

const categories = [
  {
    id: "6866a6086de9d8548aced349",
    name: "Alimentação",
  },
  {
    id: "6866a6086de9d8d349",
    name: "Transporte",
  },
  {
    id: "68086de9d8548aced349",
    name: "Lazer",
  },
  {
    id: "6866a9d8548aced349",
    name: "Contas",
  },
];
const paymentMethods = [
  {
    id: "pm-1",
    name: "Cartão de Crédito",
  },
  {
    id: "pm-2",
    name: "Pix",
  },
  {
    id: "pm-3",
    name: "Transferência Bancária",
  },
  {
    id: "pm-4",
    name: "Boleto",
  },
];

function formatarMoedaBR(valor: string) {
  const numero = valor.replace(/\D/g, "");
  if (!numero) return "0,00";
  const numeroComCentavos = (parseInt(numero, 10) / 100).toFixed(2);
  const [inteiro, decimal] = numeroComCentavos.split(".");
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${inteiroFormatado},${decimal}`;
}

const Tab = createMaterialTopTabNavigator();

function TransactionForm({ type }: any) {
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm({
    defaultValues: { valor: "", descricao: "", categoria: "" },
  });

  const inputRef = React.useRef<any>(null);

  const onSubmit = (data: any) => {
    console.log("SUBMIT =>", type, data);
  };

  return (
    <BottomSheetProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ padding: 16, flex: 1 }}>
          <Controller
            control={control}
            name="valor"
            render={({ field: { onChange, value } }) => (
              <BytebankCard
                style={{
                  backgroundColor:
                    type === "expense"
                      ? staticColors.expense
                      : staticColors.incoming,
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
            placeholder="Selecione método de pagamento"
            icon={
              <Feather
                name="dollar-sign"
                size={26}
                color={colors.onBackground}
              />
            }
          >
            <BytebankText>asdasd</BytebankText>
          </BytebankTouchableRipple>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.saveBtn}
            buttonColor={colors.primary}
          >
            Salvar
          </Button>
        </View>
      </View>
    </BottomSheetProvider>
  );
}

export default function App() {
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
        {() => <TransactionForm type="incoming" />}
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
