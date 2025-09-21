import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

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
            name="folder-add"
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
          <BytebankText variant="titleMedium">
            Personalizar categorias
          </BytebankText>
          <BytebankText style={{ maxWidth: 180, color: colors.outline }}>
            Toque aqui para criar e editar suas categorias
          </BytebankText>
        </View>
        <View>
          <AntDesign name="caret-right" size={24} color={colors.secondary} />
        </View>
      </View>
    </BytebankCard>
  );
}
