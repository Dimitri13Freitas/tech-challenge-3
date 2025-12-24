import { getPaymentMethods } from "@core/api";
import { PaymentMethod } from "@core/types/services";
import { AppStore } from "@store/useAppStore";
import { StateCreator } from "zustand";

interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  paymentMethodsError: string | null;
}

interface PaymentMethodActions {
  fetchPaymentMethods: () => Promise<void>;
}

export type PaymentMethodSlice = PaymentMethodState & PaymentMethodActions;

const createInitialPaymentMethodState = (): PaymentMethodState => ({
  paymentMethods: [],
  paymentMethodsLoading: false,
  paymentMethodsError: null,
});

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Algo inesperado aconteceu.";
};

export const createPaymentMethodSlice: StateCreator<
  AppStore,
  [],
  [],
  PaymentMethodSlice
> = (set) => ({
  ...createInitialPaymentMethodState(),

  fetchPaymentMethods: async () => {
    set({
      paymentMethodsLoading: true,
      paymentMethodsError: null,
    });

    try {
      const result = await getPaymentMethods();

      set({
        paymentMethods: result,
      });
    } catch (error) {
      set({
        paymentMethodsError: getErrorMessage(error),
      });
    } finally {
      set({
        paymentMethodsLoading: false,
      });
    }
  },
});
