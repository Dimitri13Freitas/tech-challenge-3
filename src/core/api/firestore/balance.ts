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
  // Se o userId for nulo, apenas retorna o saldo como 0 e uma função de limpeza vazia.
  if (!userId) {
    onData(0);
    return () => {};
  }

  const userRef = doc(db, "users", userId);

  // onSnapshot é a função real-time do Firebase
  const unsubscribe = onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserData;
        // Notifica o Zustand com o novo saldo (usando 0 como fallback)
        onData(userData.totalBalance ?? 0);
      } else {
        // Se o documento não existe, o saldo é 0
        onData(0);
      }
    },
    (err) => {
      // Notifica o Zustand com o erro
      onError(err as Error);
    },
  );

  return unsubscribe;
};
