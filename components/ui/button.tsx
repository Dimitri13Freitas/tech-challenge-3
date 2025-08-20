import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface BytebankButtonProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function BytebankButton({ children, style }: BytebankButtonProps) {
  const { colors } = useTheme();

  return (
    <Button style={[{ borderRadius: 8 }, style]} mode="contained">
      {children}
    </Button>
  );
}
