import { BytebankText } from "@/src/core/components";
import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export const NoCards = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 20 }}>
      <View
        style={{
          backgroundColor: colors.elevation.level5,

          borderRadius: 10,
        }}
      >
        <AntDesign
          name="credit-card"
          size={42}
          color={colors.outline}
          style={{ paddingHorizontal: 15, paddingVertical: 8 }}
        />
      </View>

      <BytebankText
        style={{
          maxWidth: "60%",
          textAlign: "center",
          marginVertical: 15,
          color: colors.outline,
        }}
      >
        Adicione um novo cartão de crédito a sua conta
      </BytebankText>
    </View>
  );
};
