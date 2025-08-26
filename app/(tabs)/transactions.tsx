import MonthSelector from "@/components/month-selector/month-selector";
import Container from "@/components/ui/container";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function TransactionScreen() {
  return (
    <View>
      <MonthSelector />
      <Container>
        <Text>Seila</Text>
      </Container>
    </View>
  );
}
