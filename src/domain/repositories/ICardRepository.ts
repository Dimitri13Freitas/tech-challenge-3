import { Card } from "@domain/entities";

export interface CardCreateData {
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}

export interface CardUpdateData {
  name?: string;
  limit?: number;
  dueDate?: number;
  closingDate?: number;
}

export interface ICardRepository {
  getCardsByUserId(userId: string): Promise<Card[]>;
  addCard(userId: string, data: CardCreateData): Promise<Card>;
  updateCard(cardId: string, data: CardUpdateData): Promise<void>;
  toggleBlockedStatus(cardId: string, blocked: boolean): Promise<void>;
}
