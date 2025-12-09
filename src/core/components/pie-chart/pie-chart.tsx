import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

interface BytebankPieChartProps {
  categories: CategoryExpense[];
}

export function BytebankPieChart({ categories }: BytebankPieChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const total = categories.reduce((sum, c) => sum + c.value, 0);

  const pieData = categories.map((cat) => {
    const percent = total > 0 ? (cat.value / total) * 100 : 0;
    return {
      name: `${percent.toFixed(0)}% ${cat.name}`,
      population: cat.value,
      color: cat.color,
      legendFontColor: colors.inverseSurface,
      legendFontSize: 14,
    };
  });

  return (
    <BytebankCard>
      <BytebankText
        variant="titleMedium"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        Despesas por Categoria
      </BytebankText>

      {total === 0 ? (
        <BytebankText style={{ textAlign: "center", paddingVertical: 32 }}>
          Nenhuma despesa registrada
        </BytebankText>
      ) : (
        <View>
          <PieChart
            data={pieData}
            width={screenWidth - 72}
            height={260}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={`${(screenWidth - 72) / 4}`}
            hasLegend={false}
            chartConfig={{
              color: () => colors.inverseSurface,
              backgroundColor: colors.elevation.level2,
              backgroundGradientFrom: colors.elevation.level2,
              backgroundGradientTo: colors.elevation.level2,
            }}
            center={[0, 0]}
          />

          <View
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "center",
            }}
          >
            {categories.map((item) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <View
                  key={item.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: item.color,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <BytebankText style={{ color: colors.inverseSurface }}>
                      {percent.toFixed(0)}% {item.name}
                    </BytebankText>
                    <BytebankText
                      variant="bodySmall"
                      style={{ color: colors.outline }}
                    >
                      {`R$ ${item.value}`}
                    </BytebankText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </BytebankCard>
  );
}
