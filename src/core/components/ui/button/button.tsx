import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface BytebankButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: React.ReactNode;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  [key: string]: any;
}

export function BytebankButton({
  children,
  style,
  mode,
  onPress,
  ...props
}: BytebankButtonProps) {
  const { colors } = useTheme();

  return (
    <Button
      onPress={onPress}
      style={[{ borderRadius: 8 }, style]}
      mode={mode ? mode : "contained"}
      {...props}
    >
      {children}
    </Button>
  );
}
