import { themeDark, themeLight } from "@/src/core/theme/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
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
  const {
    user,
    loading,
    fetchMonthlySummary,
    cardsLoading,
    monthlySummaryLoading,
    balanceLoading,
    balance,
  } = useAppStore();
  const [homeDataLoaded, setHomeDataLoaded] = useState(false);
  useFirebaseAuthObserver();
  const theme = colorScheme === "dark" ? themeDark : themeLight;

  // Carregar dados da home quando o usuário estiver autenticado
  useEffect(() => {
    if (!loading && user?.uid) {
      // O useAuthObserver já carrega cards e inicia balance listener
      // Aqui apenas carregamos o monthly summary
      fetchMonthlySummary(user.uid).catch((error) => {
        console.error("Erro ao carregar monthly summary:", error);
      });
    }
  }, [loading, user, fetchMonthlySummary]);

  // Marcar como carregado quando os dados estiverem prontos ou após timeout
  useEffect(() => {
    if (!loading) {
      if (user?.uid) {
        // Se há usuário, aguardar que cards, monthly summary e balance estejam carregados
        // Mas com timeout de segurança para evitar tela branca
        const checkDataLoaded = () => {
          const state = useAppStore.getState();
          // Verificar se cards e monthly summary terminaram de carregar
          // E se o balance já recebeu um valor inicial (não está mais carregando)
          const cardsReady = !state.cardsLoading;
          const monthlySummaryReady = !state.monthlySummaryLoading;
          const balanceReady = !state.balanceLoading && state.balance !== null;
          
          if (cardsReady && monthlySummaryReady && balanceReady) {
            setHomeDataLoaded(true);
            return true;
          }
          return false;
        };

        // Verificar imediatamente
        if (checkDataLoaded()) {
          return;
        }

        // Se não estiver pronto, aguardar um pouco e verificar novamente
        const timeout = setTimeout(() => {
          setHomeDataLoaded(true); // Forçar após 3 segundos mesmo se ainda estiver carregando
        }, 3000);

        // Verificar periodicamente
        const interval = setInterval(() => {
          if (checkDataLoaded()) {
            clearTimeout(timeout);
            clearInterval(interval);
          }
        }, 100);

        return () => {
          clearTimeout(timeout);
          clearInterval(interval);
        };
      } else {
        // Se não há usuário, não precisa carregar dados
        setHomeDataLoaded(true);
      }
    }
  }, [loading, user, cardsLoading, monthlySummaryLoading, balanceLoading, balance]);

  // Timeout de segurança absoluto - garantir que sempre escondemos a splash
  useEffect(() => {
    const absoluteTimeout = setTimeout(() => {
      setHomeDataLoaded(true);
    }, 5000); // Máximo de 5 segundos

    return () => clearTimeout(absoluteTimeout);
  }, []);

  // Verificar se todos os dados principais foram carregados
  // Aguardamos pelo balance inicial antes de esconder a splash
  const isLoading = loading || (user && !homeDataLoaded);

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
        <BottomSheetProvider>
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
