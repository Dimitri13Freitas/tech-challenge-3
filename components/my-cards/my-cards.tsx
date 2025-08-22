import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BytebankButton } from "../ui/button";
import { BytebankCard } from "../ui/card";

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
      </BytebankCard>
    </View>
  );
};
