import { BytebankText } from "@core/components";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export const NoTransactions = () => {
  const { colors } = useTheme();
  return (
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
  );
};
