import { Stack } from "expo-router";
import { BytebankText, Container } from "../core/components";

export default function NotFoundScreen() {
  return (
    <>
      <Container>
        <Stack.Screen options={{ title: "Oops!" }} />
        <BytebankText>not found</BytebankText>
      </Container>
    </>
  );
}
