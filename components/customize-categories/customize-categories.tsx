import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card";

export default function CustomizeCategories() {
  const { colors } = useTheme();

  return (
    <BytebankCard>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <AntDesign
            name="addfolder"
            size={24}
            color={colors.outline}
            style={{
              backgroundColor: colors.elevation.level1,
              padding: 8,
              borderRadius: 10,
            }}
          />
        </View>
        <View>
          <Text variant="titleMedium">Personalizar categorias</Text>
          <Text style={{ maxWidth: 180, color: colors.outline }}>
            Toque aqui para criar e editar suas categorias
          </Text>
        </View>
        <View>
          <AntDesign name="caretright" size={24} color={colors.secondary} />
        </View>
      </View>
    </BytebankCard>
  );
}
