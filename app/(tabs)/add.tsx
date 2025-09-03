import { BytebankCard } from "@/components/ui/card";
import SelectExample from "@/components/ui/select";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";

const incoming = "rgba(229, 57, 53, 1)";
const expense = "rgba(67, 160, 71, 1)";

function formatarMoedaBR(valor: string) {
  // Remove tudo que não for número
  const numero = valor.replace(/\D/g, "");
  if (!numero) return "0,00";

  // Converte para número e divide por 100 para ter centavos
  const numeroComCentavos = (parseInt(numero, 10) / 100).toFixed(2);

  // Separa parte inteira e decimal
  const [inteiro, decimal] = numeroComCentavos.split(".");

  // Adiciona separador de milhar
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Retorna no formato BR
  return `${inteiroFormatado},${decimal}`;
}

const Tab = createMaterialTopTabNavigator();

function TransactionForm({ type }: any) {
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm({
    defaultValues: { valor: "", descricao: "" },
  });
  const inputRef = React.useRef<any>(null);
  const onSubmit = (data: any) => {
    console.log(type, data);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Controller
        control={control}
        name="valor"
        render={({ field: { onChange, value } }) => (
          <BytebankCard
            style={{
              backgroundColor: type === "expense" ? incoming : expense,
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
                <Text style={styles.amountText}>R$</Text>
                <Text style={styles.amountText}>{value || "0,00"}</Text>
              </View>
            </TouchableOpacity>

            {/* TextInput invisível */}
            <TextInput
              ref={inputRef}
              value={value}
              keyboardType="numeric"
              onChangeText={(e) => onChange(formatarMoedaBR(e))}
              style={{ height: 0, width: 0, position: "absolute", opacity: 0 }}
            />
          </BytebankCard>
        )}
      />

      {/* descrição */}
      <Controller
        control={control}
        name="descricao"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            label="Descrição"
            placeholder="Adicione a descrição"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {/* categoria */}
      <Button mode="outlined" icon="shape" style={styles.fieldBtn}>
        {type === "Despesa" ? "Outros" : "Outras receitas"}
      </Button>

      {/* conta/pago com */}
      <Button mode="outlined" icon="wallet" style={styles.fieldBtn}>
        {type === "Despesa" ? "Pago com vuvu" : "Recebi em vuvu"}
      </Button>

      {/* data */}
      <Button mode="outlined" icon="calendar" style={styles.fieldBtn}>
        Hoje
      </Button>

      {/* repetir lançamento */}
      <View style={styles.row}>
        <Chip style={styles.chip}>Fixo</Chip>
        <Chip style={styles.chip}>Parcelado</Chip>
      </View>

      {/* botão salvar */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.saveBtn}
        buttonColor={colors.primary}
      >
        Salvar
      </Button>
      <SelectExample />
    </View>
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
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  input: {
    marginBottom: 16,
  },
  fieldBtn: {
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  chip: {
    marginRight: 8,
  },
  saveBtn: {
    marginTop: "auto",
    borderRadius: 50,
  },
});
