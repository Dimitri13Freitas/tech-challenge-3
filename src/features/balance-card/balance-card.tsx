import { useAppStore } from "@/src/store/useAppStore";
import { BytebankCard, BytebankText } from "@core/components";
import { formatCurrencyBR } from "@core/utils";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton, useTheme } from "react-native-paper";

export function BalanceCard() {
  const [isVisible, setIsVisible] = useState(true);
  const { colors } = useTheme();
  const {
    balance,
    balanceLoading: loading,
    balanceError: error,
  } = useAppStore();

  let balanceText = "-----";

  if (loading) {
    balanceText = "";
  } else if (error) {
    balanceText = "Erro ao carregar";
  } else if (balance !== null) {
    balanceText = formatCurrencyBR(balance, { returnZeroIfNull: true });
  }

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
                {displayValue}
              </BytebankText>
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
