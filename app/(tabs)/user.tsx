import { StyleSheet } from "react-native";

import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { useAuth } from "@/contexts/AuthContext";

export default function UserScreen() {
  const { logout } = useAuth();
  return (
    <Container>
      <BytebankButton onPress={() => logout()}>Sair</BytebankButton>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
