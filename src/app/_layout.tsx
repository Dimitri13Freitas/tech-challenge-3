import { themeDark, themeLight } from "@/src/core/theme/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, useTheme } from "react-native-paper";
import "react-native-reanimated";
import { BottomSheetProvider, SnackbarProvider } from "../core/hooks";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { user, loading } = useAuthStore();

  const theme = colorScheme === "dark" ? themeDark : themeLight;

  // Exibe uma tela de loading enquanto aguarda a verificação inicial do Firebase Auth
  // O Firebase Auth com persistência restaura automaticamente a sessão aqui
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style="auto" />
      <PaperProvider theme={theme}>
        <BottomSheetProvider snapPoints={["65%"]}>
          <SnackbarProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {user ? (
                <Stack.Screen name="(tabs)" />
              ) : (
                <Stack.Screen name="(auth)" />
              )}
              <Stack.Screen name="+not-found" />
            </Stack>
          </SnackbarProvider>
        </BottomSheetProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
