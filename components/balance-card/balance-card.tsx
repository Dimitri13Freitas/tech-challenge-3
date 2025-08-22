import { useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card";

export function BalanceCard() {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useTheme();
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
        <Text
          variant="titleMedium"
          style={{ maxWidth: "70%", paddingVertical: 8, fontWeight: "bold" }}
        >
          Seja bem-vindo à sua central de finanças!
        </Text>
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
            <Text variant="titleSmall" style={{ color: colors.outline }}>
              Saldo geral
            </Text>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              R$ {isVisible ? "1234,56" : "-----"}
            </Text>
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
