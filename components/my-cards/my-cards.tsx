import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { BytebankButton } from "../ui/button/button";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

const data = {
  _id: "6891417fb6790dbc1523cfe0",
  userId: "686c59e137e7159f930996f8",
  cardNumber: 7048365272662226,
  name: "Dimitri",
  functions: ["credit", "debit"],
  variant: "gold",
  expirationDate: "2028-08-04T23:25:51.453Z",
  cvv: 934,
  flag: "MasterCard",
  limit: 1000,
  blocked: false,
  __v: 0,
};

function formatCurrencyBRL(value: number | string): string {
  const number = typeof value === "string" ? parseFloat(value) : value;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

const typeCard = (data: any) => {
  if (data.length > 1) {
    return "Crédito e Débito";
  } else if (data[0] === "credit") {
    return "Crédito";
  } else {
    return "Débito";
  }
};

const NoCards = () => {
  const { colors } = useTheme();
  return (
    <>
      <View
        style={{
          backgroundColor: colors.elevation.level5,
          marginTop: 10,
          margin: "auto",
          borderRadius: 10,
        }}
      >
        <AntDesign
          name="credit-card"
          size={42}
          color={colors.outline}
          style={{ paddingHorizontal: 20, paddingVertical: 8 }}
        />
      </View>
      <BytebankText
        style={{
          maxWidth: "60%",
          textAlign: "center",
          margin: "auto",
          marginVertical: 20,
          color: colors.outline,
        }}
      >
        Adicione um novo cartão de crédito a sua conta
      </BytebankText>
      <BytebankButton>Adicionar cartão</BytebankButton>
    </>
  );
};

export const MyCards = () => {
  const { colors } = useTheme();
  return (
    <View>
      <BytebankCard>
        <BytebankText variant="titleMedium" style={{ fontWeight: "bold" }}>
          Meus cartões
        </BytebankText>
        <View style={{ marginVertical: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <AntDesign
                name="credit-card"
                size={28}
                color={colors.outline}
                style={{
                  padding: 8,
                  backgroundColor: colors.elevation.level5,
                  borderRadius: 8,
                }}
              />
              <View>
                <BytebankText
                  variant="titleMedium"
                  style={{ fontWeight: "bold" }}
                >
                  {data.name}
                </BytebankText>
                <BytebankText style={{ color: colors.outline }}>
                  {typeCard(data.functions)}
                </BytebankText>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 6,
              backgroundColor: colors.secondaryContainer,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <BytebankText style={{ color: colors.outline }}>
                Saldo:{" "}
                {
                  <BytebankText style={{ fontWeight: "bold" }}>
                    {formatCurrencyBRL(data.limit)}
                  </BytebankText>
                }
              </BytebankText>
              <BytebankText style={{ color: colors.outline }}>
                Status:{" "}
                {
                  <BytebankText style={{ fontWeight: "bold" }}>
                    {data.blocked ? "Bloqueado" : "Ativo"}
                  </BytebankText>
                }
              </BytebankText>
            </View>
          </View>
        </View>
        {/* <Divider /> */}
        <BytebankButton onPress={() => router.push("/register")}>
          Gerenciar Cartões
        </BytebankButton>
      </BytebankCard>
    </View>
  );
};
