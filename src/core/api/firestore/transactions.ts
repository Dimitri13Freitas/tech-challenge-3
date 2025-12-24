import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export const addTransactionService = async (
  userId: string,
  transactionData: any,
) => {
  try {
    const transactionsCollectionRef = collection(db, "transactions");

    await addDoc(transactionsCollectionRef, {
      ...transactionData,
      userId: userId,
      date: serverTimestamp(),
    });
    console.log("Transação adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar transação: ", error);
  }
};

export const addTransactionAndUpdateBalance = async (
  userId: string,
  transactionData: any,
) => {
  const userRef = doc(db, "users", userId);
  const transactionsCollectionRef = collection(
    db,
    "users",
    userId,
    "transactions",
  );

  const { valor } = transactionData;
  const valorNumber = parseFloat(valor);
  let valorDelta: number;

  if (transactionData.type === "income") {
    valorDelta = valorNumber;
  } else if (transactionData.type === "expense") {
    valorDelta = -valorNumber;
  } else {
    throw new Error("Tipo de transação inválido. Use 'income' ou 'expense'.");
  }

  try {
    await runTransaction(db, async (transaction) => {
      const newTransactionRef = doc(transactionsCollectionRef);

      transaction.set(newTransactionRef, {
        ...transactionData,
        data: new Date(),
      });

      transaction.update(userRef, {
        totalBalance: increment(valorDelta),
      });
    });

    console.log("Transação e Saldo atualizados com sucesso!");
  } catch (e) {
    console.error("Falha na transação atômica: ", e);
  }
};

export const updateTransactionAndBalance = async (
  userId: string,
  transactionId: string,
  oldTransactionData: any,
  newTransactionData: any,
) => {
  const userRef = doc(db, "users", userId);
  const transactionRef = doc(
    db,
    "users",
    userId,
    "transactions",
    transactionId,
  );
  const oldValor = parseFloat(oldTransactionData.valor);
  const oldValorDelta =
    oldTransactionData.type === "income" ? oldValor : -oldValor;
  const newValor = parseFloat(newTransactionData.valor);
  const newValorDelta =
    newTransactionData.type === "income" ? newValor : -newValor;
  const balanceDelta = newValorDelta - oldValorDelta;

  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(transactionRef, {
        ...newTransactionData,
        date: newTransactionData.date,
      });

      if (balanceDelta !== 0) {
        transaction.update(userRef, {
          totalBalance: increment(balanceDelta),
        });
      }
    });

    console.log("Transação atualizada com sucesso!");
  } catch (e) {
    console.error("Falha ao atualizar transação: ", e);
    throw new Error("Não foi possível atualizar a transação.");
  }
};

export const getTransactionsByMonth = async (
  userId: string,
  year: number,
  month: number,
) => {
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

    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(
      `Transações encontradas para ${month}/${year}:`,
      transactions.length,
    );
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações por mês:", error);
    throw new Error("Não foi possível carregar as transações.");
  }
};
