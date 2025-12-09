import { useAppStore } from "@/src/store/useAppStore";
import { useEffect, useRef } from "react";
import { firebaseAuthService, User } from "../firebase/auth";

export const useFirebaseAuthObserver = () => {
  // Usa seletores individuais para evitar re-renders desnecessários
  const setUser = useAppStore((state) => state.setUser);
  const fetchCards = useAppStore((state) => state.fetchCards);
  const startBalanceListener = useAppStore((state) => state.startBalanceListener);
  
  // Usa ref para evitar que as funções mudem e causem re-renders
  const functionsRef = useRef({ setUser, fetchCards, startBalanceListener });
  functionsRef.current = { setUser, fetchCards, startBalanceListener };

  useEffect(() => {
    let isInitialCheck = true;

    const unsubscribe = firebaseAuthService.onAuthChanged(
      async (user: User | null) => {
        const { setUser, fetchCards, startBalanceListener } = functionsRef.current;
        
        if (isInitialCheck) {
          useAppStore.setState({ user, loading: false });
          // Busca os cards e inicia listener de balance automaticamente quando o usuário autentica
          if (user?.uid) {
            await fetchCards(user.uid);
            startBalanceListener(user.uid);
          }
          isInitialCheck = false;
        } else {
          setUser(user);
          // Busca os cards e inicia listener quando o usuário faz login
          if (user?.uid) {
            await fetchCards(user.uid);
            startBalanceListener(user.uid);
          } else {
            // Limpa os cards e para o listener quando o usuário faz logout
            fetchCards(null);
            startBalanceListener(null);
          }
        }
      },
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vazio porque usamos ref para as funções
};
