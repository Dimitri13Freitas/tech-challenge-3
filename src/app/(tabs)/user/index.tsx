import { useAuth } from "@/contexts/AuthContext";
import { BytebankButton, Container } from "@/src/core/components";
import { StyleSheet } from "react-native";

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
