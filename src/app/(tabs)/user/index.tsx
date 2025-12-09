import { BytebankButton, BytebankText, Container } from "@/src/core/components";
import { useAppStore } from "@/src/store/useAppStore";

export default function UserScreen() {
  const { user, logout } = useAppStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container>
      <BytebankText>{user?.displayName}</BytebankText>
      <BytebankText>{user?.email}</BytebankText>
      <BytebankButton onPress={handleLogout}>Sair</BytebankButton>
    </Container>
  );
}
