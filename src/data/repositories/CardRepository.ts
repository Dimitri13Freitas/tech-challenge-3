import { db } from "@core/firebase/config";
import { Card } from "@domain/entities";
import {
  CardCreateData,
  CardUpdateData,
  ICardRepository,
} from "@domain/repositories";
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

export class CardRepository implements ICardRepository {
  async getCardsByUserId(userId: string): Promise<Card[]> {
    try {
      const cardsRef = collection(db, "cards");
      const q = query(
        cardsRef,
        where("userId", "==", userId),
        orderBy("name", "asc"),
      );

      const snapshot = await getDocs(q);

      const cards = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt instanceof Date
          ? data.createdAt
          : new Date();

        return Card.create(
          doc.id,
          data.userId,
          data.name,
          data.limit,
          data.blocked || false,
          data.dueDate,
          data.closingDate,
          createdAt,
        );
      });

      return cards;
    } catch (error) {
      console.error("Erro ao listar cartões do usuário: ", error);
      throw new Error("Não foi possível carregar seus cartões.");
    }
  }

  async addCard(userId: string, data: CardCreateData): Promise<Card> {
    try {
      const cardsRef = collection(db, "cards");

      const docRef = await addDoc(cardsRef, {
        userId: userId,
        name: data.name,
        limit: data.limit,
        dueDate: data.dueDate,
        closingDate: data.closingDate,
        blocked: false,
        createdAt: new Date(),
      });

      return Card.create(
        docRef.id,
        userId,
        data.name,
        data.limit,
        false,
        data.dueDate,
        data.closingDate,
        new Date(),
      );
    } catch (error) {
      console.error("Erro ao adicionar cartão: ", error);
      throw new Error("Não foi possível salvar o cartão no banco de dados.");
    }
  }

  async updateCard(cardId: string, data: CardUpdateData): Promise<void> {
    try {
      const cardsRef = collection(db, "cards");
      const cardRef = doc(cardsRef, cardId);

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.limit !== undefined) updateData.limit = data.limit;
      if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
      if (data.closingDate !== undefined)
        updateData.closingDate = data.closingDate;

      await updateDoc(cardRef, updateData);
    } catch (error) {
      console.error(`Erro ao atualizar cartão ${cardId}: `, error);
      throw new Error("Não foi possível atualizar o cartão.");
    }
  }

  async toggleBlockedStatus(cardId: string, blocked: boolean): Promise<void> {
    try {
      const cardsRef = collection(db, "cards");
      const cardRef = doc(cardsRef, cardId);

      await updateDoc(cardRef, {
        blocked: blocked,
      });
    } catch (error) {
      console.error(`Erro ao alternar status do cartão ${cardId}: `, error);
      throw new Error("Não foi possível alterar o status de bloqueio.");
    }
  }
}
