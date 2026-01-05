import { useAppStore } from "@/src/store/useAppStore";
import { User as DomainUser } from "@domain/entities";
import { authRepository } from "@infrastructure/di/useCases";
import { useEffect, useRef } from "react";

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
