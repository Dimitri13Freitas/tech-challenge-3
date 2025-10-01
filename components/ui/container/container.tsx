import React from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

export default function Container({
  children,
  style,
  scrollable = true,
}: ContainerProps) {
  const { colors } = useTheme();

  const baseStyle: ViewStyle = {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  };

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[baseStyle, style]}
      >
        {children}
        <View style={{ height: 70, width: "100%" }} />
      </ScrollView>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}
