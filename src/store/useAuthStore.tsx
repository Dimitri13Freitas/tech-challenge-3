import { auth } from "@/src/core/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

// Observa mudanças no estado do Firebase
// O Firebase Auth com persistência restaura automaticamente a sessão ao iniciar o app
let isInitialCheck = true;
onAuthStateChanged(auth, (user) => {
  // Na primeira verificação, aguarda a restauração da sessão
  if (isInitialCheck) {
    isInitialCheck = false;
    useAuthStore.setState({ user, loading: false });
  } else {
    // Em verificações subsequentes, apenas atualiza o usuário
    useAuthStore.setState({ user });
  }
});
