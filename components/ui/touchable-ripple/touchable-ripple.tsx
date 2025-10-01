import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { BytebankText } from "../text/text";

interface BytebankTouchableRippleProps {
  placeholder?: string;
  icon?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BytebankTouchableRipple = ({
  placeholder,
  icon,
  children,
  style,
}: BytebankTouchableRippleProps) => {
  const { colors } = useTheme();
  const { openBottomSheet } = useBottomSheet();

  return (
    <TouchableRipple
      rippleColor="red"
      onPress={() => openBottomSheet(children)}
      style={[
        {
          borderColor: colors.surfaceVariant,
          borderBottomWidth: 1,
          paddingVertical: 15,
          paddingHorizontal: 5,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: colors.elevation.level5,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.surfaceVariant,
          }}
        >
          {icon}
        </View>
        <BytebankText variant="titleMedium" style={{ color: colors.outline }}>
          {placeholder}
        </BytebankText>
      </View>
    </TouchableRipple>
  );
};
