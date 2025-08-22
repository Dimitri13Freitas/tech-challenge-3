import React from "react";
import { StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Card, useTheme } from "react-native-paper";

interface BytebankCardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function BytebankCard({ children, style }: BytebankCardProps) {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <Card
      style={[
        {
          marginBottom: 20,
          backgroundColor: colors.elevation.level2,
          padding: 15,
          borderRadius: 8,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        style,
      ]}
    >
      {children}
    </Card>
  );
}
