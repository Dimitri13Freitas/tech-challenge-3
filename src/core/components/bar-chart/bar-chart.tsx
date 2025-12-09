import { staticColors } from "@core/theme/theme";
import React from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

interface BytebankBarChartProps {
  data: number[];
}

export function BytebankBarChart({ data }: BytebankBarChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const infos = {
    labels: ["Receitas", "Despesas"],
    datasets: [
      {
        data: data,
        colors: [() => staticColors.income, () => staticColors.expense],
      },
    ],
  };

  return (
    <BytebankCard>
      <BytebankText
        variant="titleMedium"
        style={{ textAlign: "center", fontWeight: "bold", marginBottom: 16 }}
      >
        Receitas x Despesas (mês atual)
      </BytebankText>

      {!data ? (
        <View style={{ height: 230 }}>
          <BytebankText style={{ textAlign: "center", paddingVertical: 32 }}>
            Nenhum lançamento neste mês
          </BytebankText>
        </View>
      ) : (
        <BarChart
          data={infos}
          width={screenWidth - 72}
          height={190}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showBarTops={false}
          withInnerLines={false}
          withHorizontalLabels={false}
          showValuesOnTopOfBars={true}
          withCustomBarColorFromData={true}
          flatColor={true}
          chartConfig={{
            backgroundColor: colors.elevation.level2,
            backgroundGradientFrom: colors.elevation.level2,
            backgroundGradientTo: colors.elevation.level2,
            decimalPlaces: 0,
            color: () => colors.inverseSurface,
            propsForLabels: {
              fontSize: 14,
            },
            formatTopBarValue: (e) => "R$ " + e,
            labelColor: () => colors.inverseSurface,
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
            barRadius: 6,
          }}
        />
      )}
    </BytebankCard>
  );
}
