import React from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
export default function Container({ children, style }: ContainerProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={[
        {
          paddingTop: 40,
          paddingHorizontal: 20,
          width: "100%",
          height: "100%",
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {children}
      <View style={{ height: 70, width: "100%" }}></View>
    </ScrollView>
  );
}
