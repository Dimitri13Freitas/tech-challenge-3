import { create } from "zustand";
import { BalanceSlice, createBalanceSlice } from "./slices/balanceSlice";
import { CardSlice, createCardSlice } from "./slices/cardSlice";
import { CategorySlice, createCategorySlice } from "./slices/categorySlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";

// 1. Definição do Tipo da Store Única (Soma de todos os Slices)
// Isso permite que cada slice acesse o estado e as ações das outras
export type AppStore = UserSlice & CardSlice & BalanceSlice & CategorySlice;

// 2. Criação da Store Principal
export const useAppStore = create<AppStore>((...a) => ({
  // Chamamos a função de criação de cada slice e espalhamos seus conteúdos
  // dentro da Store principal.
  ...createUserSlice(...a),
  ...createBalanceSlice(...a),
  ...createCardSlice(...a),
  ...createCategorySlice(...a),
}));
