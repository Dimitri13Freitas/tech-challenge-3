import { BytebankCard } from "@/components/ui/card";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
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
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ["25%", "50%"], []);

  const onSubmit = (data: any) => {
    console.log("SUBMIT =>", type, data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Conteúdo principal */}
      <View style={{ padding: 16, flex: 1 }}>
        {/* valor */}
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

        {/* botão abre bottom sheet */}
        <Button
          mode="outlined"
          icon="shape"
          style={styles.fieldBtn}
          onPress={() => bottomSheetRef.current?.snapToIndex(0)}
        >
          Selecionar Categoria
        </Button>

        {/* salvar */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveBtn}
          buttonColor={colors.primary}
        >
          Salvar
        </Button>
      </View>

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <BottomSheetView>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Escolha uma categoria
            </Text>

            {["Alimentação", "Transporte", "Lazer", "Outros"].map((cat) => (
              <Chip
                key={cat}
                style={styles.chip}
                onPress={() => {
                  console.log("Categoria:", cat);
                  bottomSheetRef.current?.close();
                }}
              >
                {cat}
              </Chip>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
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
