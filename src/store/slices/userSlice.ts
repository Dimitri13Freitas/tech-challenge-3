import { signOutUseCase } from "@infrastructure/di/useCases";
import { AppStore } from "@store/useAppStore";
import type { User } from "firebase/auth";
import type { StateCreator } from "zustand";

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

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (
  set,
  get,
) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    await signOutUseCase.execute();
    set({ user: null });
    const { setLoading } = get();
    if (setLoading) {
      setLoading(false);
    }
  },
});
