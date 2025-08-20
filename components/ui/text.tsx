import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface BytebankCardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function BytebankText({ children, style }: BytebankCardProps) {
  const { colors, fonts } = useTheme();
  return <Text>{children}</Text>;
}
