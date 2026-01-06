import { getMonthlySummaryUseCase } from "@infrastructure/di/useCases";
import { AppStore } from "@store/useAppStore";
import type { StateCreator } from "zustand";

interface MonthlySummaryState {
  monthlySummary: number[] | null;
  monthlySummaryLoading: boolean;
  monthlySummaryError: string | null;
}

interface MonthlySummaryActions {
  fetchMonthlySummary: (userId: string | null | undefined) => Promise<void>;
  setMonthlySummary: (summary: number[] | null) => void;
}

export type MonthlySummarySlice = MonthlySummaryState & MonthlySummaryActions;

const createInitialMonthlySummaryState = (): MonthlySummaryState => ({
  monthlySummary: null,
  monthlySummaryLoading: false,
  monthlySummaryError: null,
});

export const createMonthlySummarySlice: StateCreator<
  AppStore,
  [],
  [],
  MonthlySummarySlice
> = (set) => ({
  ...createInitialMonthlySummaryState(),

  fetchMonthlySummary: async (userId) => {
    if (!userId) {
      set({
        monthlySummary: null,
        monthlySummaryLoading: false,
        monthlySummaryError: null,
      });
      return;
    }

    set({ monthlySummaryLoading: true, monthlySummaryError: null });

    try {
      const data = await getMonthlySummaryUseCase.execute({ userId });
      set({ monthlySummary: data, monthlySummaryLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao carregar resumo mensal";
      set({
        monthlySummaryError: errorMessage,
        monthlySummaryLoading: false,
      });
    }
  },

  setMonthlySummary: (summary) => {
    set({ monthlySummary: summary });
  },
});
