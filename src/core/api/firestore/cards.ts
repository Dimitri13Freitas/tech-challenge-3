import { AddCardData, Card } from "@core/types/services/cards/cardTypes";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export const getCardsByUserIdService = async (
  userId: string,
): Promise<Card[]> => {
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

export const addCardService = async (
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

export const updateCardService = async (
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

export const toggleCardBlockedStatusService = async (
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
