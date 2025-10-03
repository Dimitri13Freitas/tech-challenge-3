import { themeDark, themeLight } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { SnackbarProvider } from "@/contexts/SnackBarContext";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, useTheme } from "react-native-paper";
import "react-native-reanimated";
import Routes from "./routes";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  const theme = colorScheme === "dark" ? themeDark : themeLight;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style="auto" />
      <PaperProvider theme={theme}>
        <BottomSheetProvider snapPoints={["65%"]}>
          <SnackbarProvider>
            <AuthProvider>
              <Routes />
            </AuthProvider>
          </SnackbarProvider>
        </BottomSheetProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
