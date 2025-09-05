import MonthSelector from "@/components/month-selector/month-selector";
import Container from "@/components/ui/container";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const NoTransactions = () => {};

export default function TransactionScreen() {
  const { colors } = useTheme();
  return (
    <View>
      <MonthSelector />
      <Container>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              maxWidth: 250,
              margin: "auto",
            }}
            variant="headlineSmall"
          >
            Nenhum lançamento neste mês
          </Text>
          <Text
            style={{
              marginTop: 16,
              textAlign: "center",
              maxWidth: 200,
              margin: "auto",
              color: colors.outline,
            }}
          >
            Toque em + para adicionar um lançamento
          </Text>
        </View>
      </Container>
    </View>
  );
}
