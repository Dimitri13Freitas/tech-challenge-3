import { staticColors } from "@/src/core/theme/theme";
import { Feather } from "@expo/vector-icons";
import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";
import { Snackbar, useTheme } from "react-native-paper";
import { BytebankText } from "../components";

type SnackbarType = "warning" | "text" | "success";

interface SnackbarContextProps {
  showMessage: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showMessage: () => {},
});

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration] = useState(3000);
  const [type, setType] = useState<SnackbarType>("text");

  const showMessage = (msg: string, t: SnackbarType = "text") => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  };

  const getSnackbarStyle = () => {
    switch (type) {
      case "warning":
        return {
          backgroundColor: staticColors.expense,
        };
      case "success":
        return {
          backgroundColor: staticColors.income,
        };
      default:
        return {
          backgroundColor: colors.onSurface,
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <Feather name="alert-triangle" size={26} color={colors.error} />;
      case "success":
        return (
          <Feather name="check" size={26} color={colors.tertiaryContainer} />
        );
      default:
        return null;
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        style={getSnackbarStyle()}
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={duration}
        action={{
          label: "Fechar",
          textColor: colors.elevation.level4,
          onPress: () => setVisible(false),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {getIcon()}
          <BytebankText style={{ color: "white" }}>{message}</BytebankText>
        </View>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
