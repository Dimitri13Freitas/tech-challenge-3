import { db } from "@/constants/firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface UserData {
  totalBalance: number;
}

const useBalance = (userId: string | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setBalance(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userRef: DocumentReference<DocumentData> = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserData;
          setBalance(userData.totalBalance ?? 0);
        } else {
          setBalance(0);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar o saldo:", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return { balance, loading, error };
};

export default useBalance;
