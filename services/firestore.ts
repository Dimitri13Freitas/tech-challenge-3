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
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../constants/firebase";

interface AddCardData {
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}

export const createUserProfile = async (uid: string, email: string) => {
  try {
    // Referencia o documento do usuário usando o UID como ID
    const userRef = doc(db, "users", uid);

    // Cria o documento com os dados iniciais
    await setDoc(userRef, {
      email: email,
      totalBalance: 0, // Saldo inicial, conforme sua estrutura
      createdAt: new Date(), // Data de criação (útil para análises futuras)
    });
    console.log("Documento do usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o documento do usuário: ", error);
    // Você pode querer tratar o erro de forma mais robusta no seu app
  }
};

export const addTransaction = async (userId: string, transactionData: any) => {
  try {
    // Referencia a subcoleção 'transactions' dentro do documento do usuário
    // ou a coleção de nível superior 'transactions'
    const transactionsCollectionRef = collection(db, "transactions");

    // Adiciona um novo documento com os dados da transação
    // O Firestore gera automaticamente um ID para este documento
    await addDoc(transactionsCollectionRef, {
      ...transactionData,
      userId: userId, // Garante que a transação esteja ligada ao usuário
      date: serverTimestamp(), // Opcional: use serverTimestamp() para garantir a data do servidor
    });
    console.log("Transação adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar transação: ", error);
    // Trate o erro no seu aplicativo
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
    // --- 1. Busca Categorias Padrão (Globais) ---
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

    // --- 2. Busca Categorias Personalizadas do Usuário ---
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

    // --- 3. Retorna junto com cursores ---
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
    // Referencia a coleção correta para categorias personalizadas
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
    // Lança um erro para ser tratado pela função handleAddCategory no componente
    throw new Error(
      "Não foi possível adicionar a categoria ao banco de dados.",
    );
  }
};

export const removeCustomCategory = async (categoryId: string) => {
  try {
    // Referencia o documento específico na coleção de categorias do usuário
    const categoryRef = doc(db, "categories", categoryId);

    // Deleta o documento
    await deleteDoc(categoryRef);

    console.log("Categoria customizada removida com sucesso!");
  } catch (error) {
    console.error("Erro ao remover categoria customizada: ", error);
    // Lança um erro que será pego no componente
    throw new Error("Não foi possível remover a categoria do banco de dados.");
  }
};

export const getCardsByUserId = async (userId: string): Promise<Card[]> => {
  try {
    const cardsRef = collection(db, "cards");
    // 1. Cria a query: filtra pelo userId e ordena pelo nome para uma exibição consistente
    const q = query(
      cardsRef,
      where("userId", "==", userId),
      orderBy("name", "asc"),
    );

    // 2. Executa a query
    const snapshot = await getDocs(q);
    // console.log(snapshot);

    // 3. Mapeia os documentos para o formato Card[]
    const cards: Card[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      // O Firestore garante que os dados no doc.data() estão lá
      // O cast 'as Card' força o tipo, mas é mais seguro validar em apps de produção
      ...(doc.data() as Omit<Card, "id">),
    }));

    return cards;
  } catch (error) {
    console.error("Erro ao listar cartões do usuário: ", error);
    // Lança um erro customizado para ser tratado na UI
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
  // 1. Validar a entrada (ex: se o dia de fechamento faz sentido)
  if (closingDate < 1 || closingDate > 31) {
    throw new Error("O dia de fechamento deve ser entre 1 e 31.");
  }
  if (dueDate < 1 || dueDate > 31) {
    throw new Error("O dia de vencimento deve ser entre 1 e 31.");
  }

  try {
    // Coleção de cartões para dados públicos/compartilháveis
    const cardsRef = collection(db, "cards");

    await addDoc(cardsRef, {
      userId: userId,
      name: name,
      limit: limit,
      dueDate: dueDate,
      closingDate: closingDate,
      blocked: false, // Começa sempre desbloqueado
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao adicionar cartão: ", error);
    throw new Error("Não foi possível salvar o cartão no banco de dados.");
  }
};

export const updateCard = async (
  cardId: string,
  data: Omit<AddCardData, "userId">, // Usa a interface de dados, excluindo userId
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
    console.log("testeeeeee");
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
