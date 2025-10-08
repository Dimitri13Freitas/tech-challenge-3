import { BytebankText } from "@/components/ui/text/text";
import { staticColors } from "@/constants/theme";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

type TabType = "expense" | "income";

export const CategoryTabs = ({
  value,
  onChange,
}: {
  value: TabType;
  onChange: (tab: TabType) => void;
}) => {
  const { colors } = useTheme();
  const textColor =
    value === "expense" ? staticColors.expense : staticColors.income;
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.elevation.level5,
        borderRadius: 8,
        padding: 4,
        marginVertical: 12,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: 8,
          paddingVertical: 10,
          alignItems: "center",
          backgroundColor:
            value === "expense" ? colors.onSurface : "transparent",
        }}
        onPress={() => onChange("expense")}
      >
        <BytebankText
          style={{
            color: value === "expense" ? textColor : colors.outline,
            fontWeight: "bold",
          }}
        >
          Despesas
        </BytebankText>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: 8,
          paddingVertical: 10,
          alignItems: "center",
          backgroundColor:
            value === "income" ? colors.onSurface : "transparent",
        }}
        onPress={() => onChange("income")}
      >
        <BytebankText
          style={{
            color: value === "income" ? textColor : colors.outline,
            fontWeight: "bold",
          }}
        >
          Receitas
        </BytebankText>
      </TouchableOpacity>
    </View>
  );
};
