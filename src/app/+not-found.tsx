import { Stack } from "expo-router";
import { BytebankText } from "../core/components";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <BytebankText>not found</BytebankText>
    </>
  );
}
