import { db } from "@/src/core/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

interface UserData {
  totalBalance: number;
}

/**
 * Configura um listener em tempo real para o saldo do usuário.
 *
 * @param userId ID do usuário para o qual buscar o saldo.
 * @param onData Callback chamado a cada atualização bem-sucedida do saldo.
 * @param onError Callback chamado em caso de erro na escuta.
 * @returns Uma função para cancelar a subscrição (unsubscribe).
 */
export const setupBalanceListenerService = (
  userId: string,
  onData: (balance: number) => void,
  onError: (error: Error) => void,
) => {
  if (!userId) {
    onData(0);
    return () => {};
  }

  const userRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserData;
        onData(userData.totalBalance ?? 0);
      } else {
        onData(0);
      }
    },
    (err) => {
      onError(err as Error);
    },
  );

  return unsubscribe;
};
