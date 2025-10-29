import React from "react";
import { View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { BytebankText } from "../text/text";

interface BytebankTextInputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "currency" | "number";
  error?: string;
  [key: string]: any;
}

export const BytebankTextInput = ({
  type = "text",
  error,
  label,
  placeholder,
  ...props
}: BytebankTextInputProps) => {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  return (
    <View style={{ marginVertical: 4 }}>
      {label && (
        <BytebankText style={{ marginBottom: 4, fontWeight: "bold" }}>
          {label}
        </BytebankText>
      )}
      <TextInput
        error={error ? true : false}
        {...(type === "password"
          ? {
              secureTextEntry: isVisible,
              right: (
                <TextInput.Icon
                  onPress={(e) => setIsVisible(!isVisible)}
                  icon={!isVisible ? "eye-off" : "eye"}
                />
              ),
            }
          : null)}
        mode="outlined"
        placeholder={placeholder}
        {...props}
      />
      <BytebankText style={{ color: colors.error }}>
        {error ? error : " "}
      </BytebankText>
    </View>
  );
};
