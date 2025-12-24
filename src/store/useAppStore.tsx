import { create } from "zustand";
import { BalanceSlice, createBalanceSlice } from "./slices/balanceSlice";
import { CardSlice, createCardSlice } from "./slices/cardSlice";
import { CategorySlice, createCategorySlice } from "./slices/categorySlice";
import {
  createPaymentMethodSlice,
  PaymentMethodSlice,
} from "./slices/paymentMethodSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";

export type AppStore = UserSlice &
  CardSlice &
  BalanceSlice &
  CategorySlice &
  PaymentMethodSlice;

export const useAppStore = create<AppStore>((...a) => ({
  ...createUserSlice(...a),
  ...createBalanceSlice(...a),
  ...createPaymentMethodSlice(...a),
  ...createCardSlice(...a),
  ...createCategorySlice(...a),
}));
