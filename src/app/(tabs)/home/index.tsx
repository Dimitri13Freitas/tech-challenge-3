import {
  BytebankBarChart,
  BytebankCard,
  BytebankText,
  Container,
} from "@/src/core/components";
import { BalanceCard, MyCards } from "@/src/features";
import { AntDesign } from "@expo/vector-icons";
import { useAppStore } from "@store/useAppStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const { user, monthlySummary, fetchMonthlySummary } = useAppStore();
  const { colors } = useTheme();

  // Recarregar dados se necessário (por exemplo, após adicionar uma transação)
  useEffect(() => {
    if (user?.uid) {
      fetchMonthlySummary(user.uid);
    }
  }, [user?.uid, fetchMonthlySummary]);

  async function handlePress() {
    router.replace("/(tabs)/home/create-category");
  }

  return (
    <Container scrollable={true}>
      <BalanceCard />
      <MyCards />
      <BytebankBarChart data={monthlySummary} />
      <TouchableRipple onPress={handlePress}>
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
                  backgroundColor: colors.elevation.level5,
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
                Toque aqui para criar/excluir suas categorias
              </BytebankText>
            </View>
            <View>
              <AntDesign
                name="caret-right"
                size={24}
                color={colors.secondary}
              />
            </View>
          </View>
        </BytebankCard>
      </TouchableRipple>
    </Container>
  );
}
