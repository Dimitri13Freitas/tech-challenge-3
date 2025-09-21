import { BytebankCard } from "@/components/ui/card/card";
import { BytebankText } from "@/components/ui/text/text";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
import {
  Button,
  Chip,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

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

  const snapPoints = React.useMemo(() => ["98%"], []);

  const onSubmit = (data: any) => {
    console.log("SUBMIT =>", type, data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, flex: 1 }}>
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

        <TouchableRipple
          id="seila"
          onPress={(e) => console.log(e)}
          style={{
            borderColor: colors.surfaceVariant,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              display: "flex",
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
                name="attach-money"
                size={26}
                color={colors.onBackground}
              />
            </View>
            <BytebankText
              variant="titleMedium"
              style={{ color: colors.outline }}
            >
              Selecione método de pagamento
            </BytebankText>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          style={{
            borderColor: colors.surfaceVariant,
            borderTopWidth: 0,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              display: "flex",
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
              <Entypo name="list" size={26} color={colors.onBackground} />
            </View>
            <BytebankText
              variant="titleMedium"
              style={{ color: colors.outline }}
            >
              Escolha uma categoria
            </BytebankText>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          style={{
            borderColor: colors.surfaceVariant,
            borderTopWidth: 0,
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              display: "flex",
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
              <AntDesign
                name="calendar"
                size={26}
                color={colors.onBackground}
              />
            </View>
            <BytebankText
              variant="titleMedium"
              style={{ color: colors.outline }}
            >
              Escolha a data
            </BytebankText>
          </View>
        </TouchableRipple>

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

      <BottomSheet
        backgroundStyle={{
          backgroundColor: colors.inverseOnSurface,
        }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        <BottomSheetView>
          <View style={{ padding: 20 }}>
            <BytebankText style={{ fontWeight: "bold", marginBottom: 10 }}>
              Escolha uma categoria
            </BytebankText>

            {["Alimentação", "Transporte", "Lazer", "Outros"].map((cat) => (
              <Chip
                key={cat}
                style={styles.chip}
                onPress={() => {
                  console.log("Categoria:", cat);
                  bottomSheetRef.current?.close(); // fecha (desaparece)
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
