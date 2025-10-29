import { BytebankCard, BytebankText, Container } from "@/src/core/components";
import { BalanceCard } from "@/src/features/balance-card/balance-card";
import { MyCards } from "@/src/features/my-cards/my-cards";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const { colors } = useTheme();

  async function handlePress() {
    router.replace("/create-category");
  }

  return (
    <Container scrollable={true}>
      <BalanceCard />
      <MyCards />
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
