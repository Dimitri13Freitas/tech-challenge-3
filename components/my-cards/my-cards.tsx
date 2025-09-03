import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BytebankButton } from "../ui/button";
import { BytebankCard } from "../ui/card";

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
          name="creditcard"
          size={42}
          color={colors.outline}
          style={{ paddingHorizontal: 20, paddingVertical: 8 }}
        />
      </View>
      <Text
        style={{
          maxWidth: "60%",
          textAlign: "center",
          margin: "auto",
          marginVertical: 20,
          color: colors.outline,
        }}
      >
        Adicione um novo cartão de crédito a sua conta
      </Text>
      <BytebankButton>Adicionar cartão</BytebankButton>
    </>
  );
};

export const MyCards = () => {
  const { colors } = useTheme();
  return (
    <View>
      <BytebankCard>
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          Meus cartões
        </Text>
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
                name="creditcard"
                size={28}
                color={colors.outline}
                style={{
                  padding: 8,
                  backgroundColor: colors.elevation.level5,
                  borderRadius: 8,
                }}
              />
              <View>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {data.name}
                </Text>
                <Text style={{ color: colors.outline }}>
                  {typeCard(data.functions)}
                </Text>
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
              <Text style={{ color: colors.outline }}>
                Saldo:{" "}
                {
                  <Text style={{ fontWeight: "bold" }}>
                    {formatCurrencyBRL(data.limit)}
                  </Text>
                }
              </Text>
              <Text style={{ color: colors.outline }}>
                Status:{" "}
                {
                  <Text style={{ fontWeight: "bold" }}>
                    {data.blocked ? "Bloqueado" : "Ativo"}
                  </Text>
                }
              </Text>
            </View>
          </View>
        </View>
        {/* <Divider /> */}
        <BytebankButton>Gerenciar Cartões</BytebankButton>
      </BytebankCard>
    </View>
  );
};
