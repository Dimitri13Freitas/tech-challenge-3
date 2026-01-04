import { db } from "@/src/core/firebase/config";
import { IBalanceRepository } from "@domain/repositories";
import { doc, increment, onSnapshot, runTransaction } from "firebase/firestore";

interface UserData {
  totalBalance: number;
}

export class BalanceRepository implements IBalanceRepository {
  async getBalance(userId: string): Promise<number> {
    // Esta implementação requer uma chamada síncrona, mas Firebase é assíncrono
    // Por enquanto, retornamos 0 e usamos subscribeToBalance para valores reais
    return 0;
  }

  async updateBalance(userId: string, delta: number): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);

      await runTransaction(db, async (transaction) => {
        transaction.update(userRef, {
          totalBalance: increment(delta),
        });
      });
    } catch (error) {
      console.error("Erro ao atualizar saldo: ", error);
      throw new Error("Não foi possível atualizar o saldo.");
    }
  }

  subscribeToBalance(
    userId: string,
    callback: (balance: number) => void,
  ): () => void {
    if (!userId) {
      callback(0);
      return () => {};
    }

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserData;
          callback(userData.totalBalance ?? 0);
        } else {
          callback(0);
        }
      },
      (err) => {
        console.error("Erro ao escutar saldo: ", err);
        callback(0);
      },
    );

    return unsubscribe;
  }
}


