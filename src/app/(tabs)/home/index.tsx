import {
  BytebankBarChart,
  BytebankCard,
  BytebankText,
  Container,
} from "@/src/core/components";
import { BalanceCard, MyCards } from "@/src/features";
import { getMonthlySummary } from "@core/api/firestore/reports";
import { AntDesign } from "@expo/vector-icons";
import { useAppStore } from "@store/useAppStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const { user } = useAppStore();
  const { colors } = useTheme();
  const [total, setTotal] = useState<any>();

  useEffect(() => {
    async function teste() {
      if (user) {
        const total = await getMonthlySummary(user?.uid);
        setTotal(total);
        // console.log(total);
      }
    }

    teste();
  }, []);

  async function handlePress() {
    router.replace("/(tabs)/home/create-category");
  }

  return (
    <Container scrollable={true}>
      <BalanceCard />
      <MyCards />
      <BytebankBarChart data={total} />
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
