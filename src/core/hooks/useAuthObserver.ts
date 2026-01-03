import { useAppStore } from "@/src/store/useAppStore";
import { useEffect, useRef } from "react";
import { authRepository } from "@infrastructure/di/useCases";
import { User as DomainUser } from "@domain/entities";

export const useFirebaseAuthObserver = () => {
  const setUser = useAppStore((state) => state.setUser);
  const fetchCards = useAppStore((state) => state.fetchCards);
  const startBalanceListener = useAppStore(
    (state) => state.startBalanceListener,
  );
  const functionsRef = useRef({ setUser, fetchCards, startBalanceListener });
  functionsRef.current = { setUser, fetchCards, startBalanceListener };

  useEffect(() => {
    let isInitialCheck = true;

    const unsubscribe = authRepository.onAuthStateChanged(
      async (domainUser: DomainUser | null) => {
        const { setUser, fetchCards, startBalanceListener } =
          functionsRef.current;

        // Converter DomainUser para Firebase User (compatibilidade)
        const firebaseUser = domainUser
          ? ({
              uid: domainUser.uid,
              email: domainUser.email,
              displayName: domainUser.displayName,
              emailVerified: domainUser.emailVerified,
            } as any)
          : null;

        if (isInitialCheck) {
          useAppStore.setState({ user: firebaseUser, loading: false });
          if (domainUser?.uid) {
            await fetchCards(domainUser.uid);
            startBalanceListener(domainUser.uid);
          }
          isInitialCheck = false;
        } else {
          setUser(firebaseUser);
          if (domainUser?.uid) {
            await fetchCards(domainUser.uid);
            startBalanceListener(domainUser.uid);
          } else {
            fetchCards(null);
            startBalanceListener(null);
          }
        }
      },
    );

    return () => unsubscribe();
  }, []);
};
