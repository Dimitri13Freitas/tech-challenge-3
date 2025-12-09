import { setupBalanceListenerService } from "@/src/core/api";
import type { StateCreator } from "zustand";
import type { AppStore } from "../useAppStore";

// --- TIPAGENS ---

// Definindo a função de unsubscribe do Firestore
type Unsubscribe = () => void;

interface BalanceState {
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  // Armazena a função de cleanup do Firebase para que possa ser chamada depois
  unsubscribeBalance: Unsubscribe | null;
}

interface BalanceActions {
  startBalanceListener: (userId: string | null | undefined) => void;
  stopBalanceListener: () => void;
}

export type BalanceSlice = BalanceState & BalanceActions;

// --- ESTADO INICIAL ---

const createInitialBalanceState = (): BalanceState => ({
  balance: null,
  balanceLoading: false,
  balanceError: null,
  unsubscribeBalance: null,
});

// --- FUNÇÃO SLICE ---

export const createBalanceSlice: StateCreator<
  AppStore,
  [],
  [],
  BalanceSlice
> = (set, get) => ({
  ...createInitialBalanceState(),

  /**
   * Inicia o listener em tempo real para o saldo do usuário.
   * Ele primeiro limpa qualquer listener ativo.
   */
  startBalanceListener: (userId) => {
    // 1. Limpa qualquer listener ativo para evitar duplicação
    get().stopBalanceListener();

    if (!userId) {
      set({ balance: 0, balanceLoading: false, balanceError: null });
      return;
    }

    set({ balanceLoading: true, balanceError: null });

    // --- Callbacks para o Serviço ---

    // Callback para quando novos dados são recebidos
    const onData = (newBalance: number) => {
      set({ balance: newBalance, balanceLoading: false, balanceError: null });
    };

    // Callback para quando ocorre um erro
    const onError = (error: Error) => {
      set({ balanceError: error.message, balanceLoading: false });
    };

    // --- Chama a camada de Serviço ---
    const unsubscribe = setupBalanceListenerService(userId, onData, onError);

    // 2. Armazena a função de unsubscribe no estado
    set({ unsubscribeBalance: unsubscribe });
  },

  /**
   * Para a subscrição do Firebase (cleanup).
   */
  stopBalanceListener: () => {
    const unsubscribe = get().unsubscribeBalance;
    if (unsubscribe) {
      unsubscribe();
      // Limpa a referência
      set({ unsubscribeBalance: null });
    }
  },
});
