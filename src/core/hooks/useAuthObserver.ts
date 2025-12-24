import { useAppStore } from "@/src/store/useAppStore";
import { useEffect, useRef } from "react";
import { firebaseAuthService, User } from "../firebase/auth";

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

    const unsubscribe = firebaseAuthService.onAuthChanged(
      async (user: User | null) => {
        const { setUser, fetchCards, startBalanceListener } =
          functionsRef.current;

        if (isInitialCheck) {
          useAppStore.setState({ user, loading: false });
          if (user?.uid) {
            await fetchCards(user.uid);
            startBalanceListener(user.uid);
          }
          isInitialCheck = false;
        } else {
          setUser(user);
          if (user?.uid) {
            await fetchCards(user.uid);
            startBalanceListener(user.uid);
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
