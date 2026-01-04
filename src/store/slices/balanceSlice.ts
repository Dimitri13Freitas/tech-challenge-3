import { setupBalanceListenerService } from "@/src/core/api";
import { AppStore } from "@store/useAppStore";
import type { StateCreator } from "zustand";

type Unsubscribe = () => void;

interface BalanceState {
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  unsubscribeBalance: Unsubscribe | null;
}

interface BalanceActions {
  startBalanceListener: (userId: string | null | undefined) => void;
  stopBalanceListener: () => void;
}

export type BalanceSlice = BalanceState & BalanceActions;

const createInitialBalanceState = (): BalanceState => ({
  balance: null,
  balanceLoading: false,
  balanceError: null,
  unsubscribeBalance: null,
});

export const createBalanceSlice: StateCreator<
  AppStore,
  [],
  [],
  BalanceSlice
> = (set, get) => ({
  ...createInitialBalanceState(),

  startBalanceListener: (userId) => {
    get().stopBalanceListener();

    if (!userId) {
      set({ balance: 0, balanceLoading: false, balanceError: null });
      return;
    }

    set({ balanceLoading: true, balanceError: null });

    const onData = (newBalance: number) => {
      set({ balance: newBalance, balanceLoading: false, balanceError: null });
    };

    const onError = (error: Error) => {
      set({ balanceError: error.message, balanceLoading: false });
    };

    const unsubscribe = setupBalanceListenerService(userId, onData, onError);

    set({ unsubscribeBalance: unsubscribe });
  },

  stopBalanceListener: () => {
    const unsubscribe = get().unsubscribeBalance;
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribeBalance: null });
    }
  },
});
