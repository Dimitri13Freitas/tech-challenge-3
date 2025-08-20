import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { BytebankButton } from "../ui/button";
import { BytebankCard } from "../ui/card";

export const MyCards = () => {
  return (
    <View>
      <BytebankCard>
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          Meus cartões
        </Text>
        {/* Imagem ilustrativa sobre cartão */}
        <Text style={{ maxWidth: "60%", textAlign: "center", margin: "auto" }}>
          Adicione um novo cartão de crédito a sua conta
        </Text>
        <BytebankButton>Adicionar cartão</BytebankButton>
      </BytebankCard>
    </View>
  );
};
