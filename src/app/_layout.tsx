import { themeDark, themeLight } from "@/src/core/theme/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, useTheme } from "react-native-paper";
import {
  BottomSheetProvider,
  SnackbarProvider,
  useFirebaseAuthObserver,
} from "../core/hooks";
import { useAppStore } from "../store/useAppStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { user, loading, cardsLoading, balanceLoading } = useAppStore();
  useFirebaseAuthObserver();

  const theme = colorScheme === "dark" ? themeDark : themeLight;

  // Determina se ainda está carregando (auth, cards ou balance)
  const isLoading = loading || (user && (cardsLoading || balanceLoading));

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
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
