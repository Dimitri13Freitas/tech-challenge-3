import { db, storage } from "@/src/core/firebase/config";
import { Card } from "@/types/services/cards/cardTypes";
import {
  Category,
  CombinedCategoriesResult,
} from "@/types/services/categories/categoryTypes";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

interface AddCardData {
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}

export const createUserProfile = async (uid: string, email: string) => {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
      email: email,
      totalBalance: 0,
      createdAt: new Date(),
    });
    console.log("Documento do usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o documento do usuário: ", error);
  }
};

export const addTransaction = async (userId: string, transactionData: any) => {
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

export const getCombinedCategories = async (
  userId: string,
  type: "expense" | "income" | "all" = "expense",
  pageSize: number = 10,
  lastStandardDoc?: QueryDocumentSnapshot<DocumentData> | null,
  lastUserDoc?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<CombinedCategoriesResult> => {
  try {
    const standardRef = collection(db, "standardCategories");

    let standardQuery =
      type === "all"
        ? query(standardRef, orderBy("name"), limit(pageSize))
        : query(
            standardRef,
            where("type", "==", type),
            orderBy("name"),
            limit(pageSize),
          );

    if (lastStandardDoc) {
      standardQuery = query(
        standardRef,
        ...(type === "all" ? [] : [where("type", "==", type)]),
        orderBy("name"),
        startAfter(lastStandardDoc),
        limit(pageSize),
      );
    }

    const standardSnapshot = await getDocs(standardQuery);
    const standardCategories: Category[] = standardSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id" | "isCustom">),
      isCustom: false,
    }));

    const newLastStandardDoc =
      standardSnapshot.docs[standardSnapshot.docs.length - 1] || null;

    const userRef = collection(db, "categories");

    const userFilters = [where("userId", "==", userId)];
    if (type !== "all") {
      userFilters.push(where("type", "==", type));
    }

    let userQuery = query(
      userRef,
      ...userFilters,
      orderBy("name"),
      limit(pageSize),
    );

    if (lastUserDoc) {
      userQuery = query(
        userRef,
        ...userFilters,
        orderBy("name"),
        startAfter(lastUserDoc),
        limit(pageSize),
      );
    }

    const userSnapshot = await getDocs(userQuery);
    const userCategories: Category[] = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id" | "isCustom">),
      isCustom: true,
    }));

    const newLastUserDoc =
      userSnapshot.docs[userSnapshot.docs.length - 1] || null;
    return {
      categories: [...standardCategories, ...userCategories],
      lastStandardDoc: newLastStandardDoc,
      lastUserDoc: newLastUserDoc,
    };
  } catch (error) {
    console.error("Erro ao buscar categorias combinadas: ", error);
    return { categories: [], lastStandardDoc: null, lastUserDoc: null };
  }
};

export const addCustomCategory = async (
  userId: string,
  name: string,
  type: "expense" | "income",
) => {
  if (!["expense", "income"].includes(type)) {
    throw new Error(
      'Tipo de categoria inválido. Deve ser "expense" ou "income".',
    );
  }

  try {
    const userCategoriesRef = collection(db, "categories");

    await addDoc(userCategoriesRef, {
      userId: userId,
      name: name,
      type: type,
      createdAt: new Date(),
    });

    console.log("Categoria customizada adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar categoria customizada: ", error);
    throw new Error(
      "Não foi possível adicionar a categoria ao banco de dados.",
    );
  }
};

export const removeCustomCategory = async (categoryId: string) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);

    await deleteDoc(categoryRef);

    console.log("Categoria customizada removida com sucesso!");
  } catch (error) {
    console.error("Erro ao remover categoria customizada: ", error);
    throw new Error("Não foi possível remover a categoria do banco de dados.");
  }
};

export const getCardsByUserId = async (userId: string): Promise<Card[]> => {
  try {
    const cardsRef = collection(db, "cards");
    const q = query(
      cardsRef,
      where("userId", "==", userId),
      orderBy("name", "asc"),
    );

    const snapshot = await getDocs(q);

    const cards: Card[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Card, "id">),
    }));

    return cards;
  } catch (error) {
    console.error("Erro ao listar cartões do usuário: ", error);
    throw new Error("Não foi possível carregar seus cartões.");
  }
};

export const addCard = async (
  userId: string,
  name: string,
  limit: number,
  dueDate: number,
  closingDate: number,
) => {
  if (closingDate < 1 || closingDate > 31) {
    throw new Error("O dia de fechamento deve ser entre 1 e 31.");
  }
  if (dueDate < 1 || dueDate > 31) {
    throw new Error("O dia de vencimento deve ser entre 1 e 31.");
  }

  try {
    const cardsRef = collection(db, "cards");

    await addDoc(cardsRef, {
      userId: userId,
      name: name,
      limit: limit,
      dueDate: dueDate,
      closingDate: closingDate,
      blocked: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao adicionar cartão: ", error);
    throw new Error("Não foi possível salvar o cartão no banco de dados.");
  }
};

export const updateCard = async (
  cardId: string,
  data: Omit<AddCardData, "userId">,
): Promise<void> => {
  try {
    const cardsRef = collection(db, "cards");
    const cardRef = doc(cardsRef, cardId);

    await updateDoc(cardRef, {
      name: data.name,
      limit: data.limit,
      dueDate: data.dueDate,
      closingDate: data.closingDate,
    });
  } catch (error) {
    console.error(`Erro ao atualizar cartão ${cardId}: `, error);
    throw new Error("Não foi possível atualizar o cartão.");
  }
};

export const toggleCardBlockedStatus = async (
  cardId: string,
  newBlockedStatus: boolean,
): Promise<void> => {
  try {
    const cardsRef = collection(db, "cards");
    const cardRef = doc(cardsRef, cardId);

    await updateDoc(cardRef, {
      blocked: newBlockedStatus,
    });
  } catch (error) {
    console.error(`Erro ao alternar status do cartão ${cardId}: `, error);
    throw new Error("Não foi possível alterar o status de bloqueio.");
  }
};

export const getPaymentMethods = async (
  type: "expense" | "income",
): Promise<string[]> => {
  try {
    const q = query(
      collection(db, "paymentMethods"),
      where("type", "==", type),
    );

    const querySnapshot = await getDocs(q);

    const methods = querySnapshot.docs.map((doc) => doc.data().name);

    return methods;
  } catch (error) {
    console.error("Erro ao buscar métodos de pagamento:", error);
    return [];
  }
};

export const uploadFile = async (
  userId: string,
  fileUri: string,
  fileName: string,
  fileType: string,
): Promise<string> => {
  try {
    const storageRef = ref(
      storage,
      `transactions/${userId}/${Date.now()}_${fileName}`,
    );

    const response = await fetch(fileUri);
    const blob = await response.blob();

    const uploadTask = await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(uploadTask.ref);

    console.log("Arquivo enviado com sucesso:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw new Error("Não foi possível enviar o arquivo.");
  }
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log("Arquivo deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    throw new Error("Não foi possível deletar o arquivo.");
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

// Função para buscar transações por mês
export const getTransactionsByMonth = async (
  userId: string,
  year: number,
  month: number,
) => {
  try {
    // Criar datas de início e fim do mês
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
