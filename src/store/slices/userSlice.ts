// src/store/slices/userSlice.ts

import { firebaseAuthService } from "@/src/core/firebase/auth";
import type { User } from "firebase/auth";
import type { StateCreator } from "zustand";
import type { AppStore } from "../useAppStore"; // Tipo da Store Única

// Tipos
export interface UserState {
  user: User | null;
  loading: boolean;
}

export interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export type UserSlice = UserState & UserActions;

// Função da Slice
export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (
  set,
  get,
) => ({
  // Estado
  user: null,
  loading: true,

  // Ações
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  // Assumindo que a função signOut e a variável auth são importadas/acessíveis
  logout: async () => {
    await firebaseAuthService.signOut();
    // Exemplo: await signOut(auth);
    set({ user: null });
    const { setLoading } = get();
    if (setLoading) {
      setLoading(false);
    }
  },
});
