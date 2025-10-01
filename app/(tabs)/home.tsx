import { BalanceCard } from "@/components/balance-card/balance-card";
import CustomizeCategories from "@/components/customize-categories/customize-categories";
import { MyCards } from "@/components/my-cards/my-cards";
import Container from "@/components/ui/container/container";

export default function HomeScreen() {
  return (
    <Container>
      <BalanceCard />
      <MyCards />
      <CustomizeCategories />
    </Container>
  );
}
