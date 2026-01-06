import { create } from "zustand";
import { BalanceSlice, createBalanceSlice } from "./slices/balanceSlice";
import { CardSlice, createCardSlice } from "./slices/cardSlice";
import { CategorySlice, createCategorySlice } from "./slices/categorySlice";
import {
  createMonthlySummarySlice,
  MonthlySummarySlice,
} from "./slices/monthlySummarySlice";
import {
  createPaymentMethodSlice,
  PaymentMethodSlice,
} from "./slices/paymentMethodSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";

export type AppStore = UserSlice &
  CardSlice &
  BalanceSlice &
  CategorySlice &
  PaymentMethodSlice &
  MonthlySummarySlice;

export const useAppStore = create<AppStore>((...a) => ({
  ...createUserSlice(...a),
  ...createBalanceSlice(...a),
  ...createPaymentMethodSlice(...a),
  ...createCardSlice(...a),
  ...createCategorySlice(...a),
  ...createMonthlySummarySlice(...a),
}));
