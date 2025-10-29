import { create } from "zustand";

interface AuthState {
  user: { uid: string; name: string; email: string } | null;
  loading: boolean;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),
}));
