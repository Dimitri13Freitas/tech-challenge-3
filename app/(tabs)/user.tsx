import { StyleSheet } from "react-native";

import { BytebankText } from "@/components/ui/text/text";

export default function UserScreen() {
  return <BytebankText>seila</BytebankText>;
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
