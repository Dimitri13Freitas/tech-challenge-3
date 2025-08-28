import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BytebankButton } from "../ui/button";
import { BytebankCard } from "../ui/card";

const data = [
  {
    _id: "686367017dad6840720d6282",
    userId: "6861d7cf2e40177f08d6b236",
    cardNumber: 2429280541397358,
    name: "cartão teste 2",
    functions: ["credit"],
    variant: "platinum",
    expirationDate: "2028-07-01T04:41:37.174Z",
    cvv: 527,
    flag: "Visa",
    blocked: false,
    __v: 0,
  },
  {
    _id: "6872be540b2c1abc68362566",
    userId: "6861d7cf2e40177f08d6b236",
    cardNumber: 3125570829441307,
    name: "cartão teste 2",
    functions: ["credit"],
    variant: "platinum",
    expirationDate: "2028-07-12T19:58:12.134Z",
    cvv: 177,
    flag: "MasterCard",
    blocked: false,
    __v: 0,
  },
];

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
        <View
          style={{
            marginTop: 20,
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
                // backgroundColor: colors.elevation.level1,
                backgroundColor: colors.elevation.level5,
                borderRadius: 8,
              }}
            />
            <View>
              <Text>Nome do cartão</Text>
              <Text style={{ color: colors.outline }}>Tipo do cartão</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 6,
            backgroundColor: colors.elevation.level1,
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
              Saldo: {<Text>R$ 2000,00</Text>}
            </Text>
            <Text style={{ color: colors.outline }}>
              Status: {<Text>Ativo</Text>}
            </Text>
          </View>
        </View>
      </BytebankCard>
    </View>
  );
};
