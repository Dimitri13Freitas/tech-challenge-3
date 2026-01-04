import { db } from "@core/firebase/config";
import { Transaction } from "@domain/entities";
import { ITransactionRepository } from "@domain/repositories";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";

export class TransactionRepository implements ITransactionRepository {
  async addTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const transactionsCollectionRef = collection(
        db,
        "users",
        transaction.userId,
        "transactions",
      );

      const docRef = await addDoc(transactionsCollectionRef, {
        valor: transaction.valor.toString(),
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
        category: {
          id: transaction.category.id,
          name: transaction.category.name,
          isCustom: transaction.category.isCustom,
        },
        date: transaction.date,
        userId: transaction.userId,
      });

      return Transaction.create(
        docRef.id,
        transaction.valor,
        transaction.type,
        transaction.paymentMethod,
        transaction.category,
        transaction.date,
        transaction.userId,
      );
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      throw new Error("Não foi possível adicionar a transação.");
    }
  }

  async updateTransaction(
    transactionId: string,
    transaction: Partial<Transaction>,
  ): Promise<void> {
    try {
      if (!transaction.userId) {
        throw new Error("UserId é obrigatório para atualizar transação");
      }

      const transactionRef = doc(
        db,
        "users",
        transaction.userId,
        "transactions",
        transactionId,
      );

      const updateData: any = {};

      if (transaction.valor !== undefined) {
        updateData.valor = transaction.valor.toString();
      }
      if (transaction.type !== undefined) {
        updateData.type = transaction.type;
      }
      if (transaction.paymentMethod !== undefined) {
        updateData.paymentMethod = transaction.paymentMethod;
      }
      if (transaction.category !== undefined) {
        updateData.category = {
          id: transaction.category.id,
          name: transaction.category.name,
          isCustom: transaction.category.isCustom,
        };
      }
      if (transaction.date !== undefined) {
        updateData.date = transaction.date;
      }

      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar transação: ", error);
      throw new Error("Não foi possível atualizar a transação.");
    }
  }

  async getTransactionsByMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<Transaction[]> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const transactionsRef = collection(db, `users/${userId}/transactions`);

      const q = query(
        transactionsRef,
        where("date", ">=", startOfMonth),
        where("date", "<=", endOfMonth),
        orderBy("date", "desc"),
      );

      const querySnapshot = await getDocs(q);

      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.date?.toDate
          ? data.date.toDate()
          : data.date instanceof Date
          ? data.date
          : new Date(data.date);

        return Transaction.create(
          doc.id,
          parseFloat(data.valor || "0"),
          data.type,
          data.paymentMethod || "",
          doc.data().category,
          date,
          userId,
        );
      });

      return transactions;
    } catch (error) {
      console.error("Erro ao buscar transações por mês:", error);
      throw new Error("Não foi possível carregar as transações.");
    }
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
}

