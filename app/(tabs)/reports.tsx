import Container from "@/components/ui/container/container";
import { BytebankText } from "@/components/ui/text/text";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";

export default function ReportsScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Cabeçalho */}
      <View
        style={{
          backgroundColor: colors.primaryContainer,
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: 15,
        }}
      >
        <BytebankText
          variant="titleMedium"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Resumo Financeiro
        </BytebankText>
      </View>

      {/* Gráfico */}

      <Container>
        <View>
          <BytebankText>Bezier Line Chart</BytebankText>
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get("window").width - 40} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </Container>
    </View>
  );
}
