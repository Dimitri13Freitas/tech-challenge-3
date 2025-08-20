import { BalanceCard } from "@/components/balance-card/balance-card";
import Container from "@/components/container/container";
import { MyCards } from "@/components/my-cards/my-cards";
import { useState } from "react";
import { useTheme } from "react-native-paper";

export default function HomeScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useTheme();
  return (
    <Container>
      <BalanceCard />
      <MyCards />
    </Container>
  );
}
