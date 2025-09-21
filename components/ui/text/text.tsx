import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Text } from "react-native-paper";

interface BytebankTextProps {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  [key: string]: any;
}

export function BytebankText({ children, style, ...props }: BytebankTextProps) {
  return (
    <Text {...props} style={style}>
      {children}
    </Text>
  );
}
