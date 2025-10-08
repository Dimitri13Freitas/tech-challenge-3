import { useAuth } from "@/contexts/AuthContext";
import useBalance from "@/contexts/useBalance";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton, useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

const formatCurrency = (value: number | null): string => {
  if (value === null) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function BalanceCard() {
  const [isVisible, setIsVisible] = useState(true);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { balance, loading, error } = useBalance(user?.uid ? user?.uid : null);

  let balanceText = "-----";

  if (loading) {
    // Se estiver carregando, exibe o indicador ou a máscara
    balanceText = "Carregando...";
  } else if (error) {
    // Se houver erro, exibe uma mensagem
    balanceText = "Erro ao carregar";
  } else if (balance !== null) {
    // Se o saldo for carregado, formata o valor
    balanceText = formatCurrency(balance);
  }

  // Valor que será realmente exibido
  const displayValue = isVisible ? balanceText : "-----";

  return (
    <View>
      <BytebankCard
        style={{
          marginBottom: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: colors.primaryContainer,
        }}
      >
        <BytebankText
          variant="titleMedium"
          style={{ maxWidth: "70%", paddingVertical: 8, fontWeight: "bold" }}
        >
          Seja bem-vindo à sua central de finanças!
        </BytebankText>
      </BytebankCard>
      <BytebankCard style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <BytebankText
              variant="titleSmall"
              style={{ color: colors.outline }}
            >
              Saldo geral
            </BytebankText>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BytebankText variant="titleLarge" style={{ fontWeight: "bold" }}>
                {/* Aqui exibimos o valor processado */}
                {displayValue}
              </BytebankText>
              {/* Opcional: Indicador de carregamento ao lado do texto */}
              {loading && balance === null && (
                <ActivityIndicator size="small" style={{ marginLeft: 10 }} />
              )}
            </View>
          </View>
          <IconButton
            icon={!isVisible ? "eye" : "eye-off"}
            size={24}
            onPress={() => setIsVisible(!isVisible)}
            accessibilityLabel="Alternar visibilidade do saldo"
          />
        </View>
      </BytebankCard>
    </View>
  );
}
