import { BytebankButton, BytebankText, Container } from "@/src/core/components";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function UserScreen() {
  const { user, logout } = useAuthStore();

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
