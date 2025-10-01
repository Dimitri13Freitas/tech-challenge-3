import MonthSelector from "@/components/month-selector/month-selector";
import Container from "@/components/ui/container/container";
import { BytebankText } from "@/components/ui/text/text";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const NoTransactions = () => {};

export default function TransactionScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <MonthSelector />
      <Container scrollable={false}>
        <View>
          <BytebankText
            style={{
              textAlign: "center",
              fontWeight: "bold",
              maxWidth: 250,
              margin: "auto",
            }}
            variant="headlineSmall"
          >
            Nenhum lançamento neste mês
          </BytebankText>
          <BytebankText
            style={{
              marginTop: 16,
              textAlign: "center",
              maxWidth: 200,
              margin: "auto",
              color: colors.outline,
            }}
          >
            Toque em + para adicionar um lançamento
          </BytebankText>
        </View>
      </Container>
    </View>
  );
}
