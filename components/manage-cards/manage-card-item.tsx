import { staticColors } from "@/constants/theme";
import { Card } from "@/types/services/cards/cardTypes";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "react-native-paper";
import { BytebankText } from "../ui/text/text";

interface ManageCardItemProps {
  card: Card;
  [key: string]: any;
}

// Helper para formatar moeda
function formatCurrencyBRL(value: number | string): string {
  const number = typeof value === "string" ? parseFloat(value) : value;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export const ManageCardItem = ({ card, ...props }: ManageCardItemProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      {...props}
      style={({ pressed }) => ({
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 4,
        marginTop: 4,
        backgroundColor: pressed ? colors.elevation.level1 : colors.background,
      })}
    >
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
                backgroundColor: colors.elevation.level1,
                borderRadius: 8,
              }}
            />
            <View>
              <BytebankText
                variant="titleMedium"
                style={{ fontWeight: "bold" }}
              >
                {card.name}
              </BytebankText>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 46,
                }}
              >
                <BytebankText style={{ color: colors.outline, fontSize: 12 }}>
                  Venc. dia {String(card.dueDate).padStart(2, "0")}/
                  {new Date().getMonth() + 1}
                </BytebankText>
                <BytebankText style={{ color: colors.outline, fontSize: 12 }}>
                  Fech. dia {String(card.closingDate).padStart(2, "0")}/
                  {new Date().getMonth() + 1}
                </BytebankText>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 12,
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
            }}
          >
            <BytebankText style={{ color: colors.outline }}>
              Limite:{" "}
              <BytebankText style={{ fontWeight: "bold" }}>
                {formatCurrencyBRL(card.limit)}
              </BytebankText>
            </BytebankText>

            <BytebankText style={{ color: colors.outline }}>
              Status:{" "}
              <BytebankText
                style={{
                  fontWeight: "bold",
                  color: card?.blocked
                    ? staticColors.expense
                    : staticColors.incoming,
                }}
              >
                {card?.blocked ? "Bloqueado" : "Ativo"}
              </BytebankText>
            </BytebankText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
