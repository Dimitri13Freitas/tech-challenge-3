import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
