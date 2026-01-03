import { Card } from "@core/types/services/cards/cardTypes";
import {
  addCardUseCase,
  getCardsUseCase,
  toggleCardBlockedStatusUseCase,
  updateCardUseCase,
} from "@infrastructure/di/useCases";
import { AppStore } from "@store/useAppStore";
import { Timestamp } from "firebase/firestore";
import { StateCreator } from "zustand";

interface CardState {
  cards: Card[];
  cardsLoading: boolean;
  cardsError: string | null;
}

interface CardActions {
  fetchCards: (userId: string | null | undefined) => Promise<void>;
  setCards: (cards: Card[]) => void;
  addCard: (
    userId: string,
    card: Pick<Card, "name" | "limit" | "dueDate" | "closingDate">,
  ) => Promise<void>;
  updateCard: (
    cardId: string,
    card: Pick<Card, "name" | "limit" | "dueDate" | "closingDate">,
  ) => Promise<void>;
  toggleCardBlockedStatus: (cardId: string, blocked: boolean) => Promise<void>;
}

export type CardSlice = CardActions & CardState;

const createInitialCardState = (): CardState => ({
  cards: [],
  cardsLoading: false,
  cardsError: null,
});

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Algo inesperado aconteceu.";
};

export const createCardSlice: StateCreator<AppStore, [], [], CardSlice> = (
  set,
  get,
) => ({
  ...createInitialCardState(),

  fetchCards: async (userId) => {
    if (!userId) {
      set(() => ({
        cards: [],
        cardsLoading: false,
        cardsError: null,
      }));
      return;
    }

    set(() => ({
      cardsLoading: true,
      cardsError: null,
    }));

    try {
      const domainCards = await getCardsUseCase.execute({ userId });
      const cards: Card[] = domainCards.map((card) => ({
        id: card.id,
        userId: card.userId,
        name: card.name,
        limit: card.limit,
        blocked: card.blocked,
        dueDate: card.dueDate,
        closingDate: card.closingDate,
        createdAt: Timestamp.fromDate(card.createdAt),
      }));
      set(() => ({ cards }));
    } catch (error) {
      set(() => ({ cardsError: getErrorMessage(error) }));
    } finally {
      set(() => ({ cardsLoading: false }));
    }
  },

  setCards: (cards) => {
    set(() => ({ cards }));
  },

  addCard: async (userId, card) => {
    await addCardUseCase.execute({
      userId,
      name: card.name,
      limit: card.limit,
      dueDate: card.dueDate,
      closingDate: card.closingDate,
    });

    await get().fetchCards(userId);
  },

  updateCard: async (cardId, card) => {
    await updateCardUseCase.execute({
      cardId,
      data: {
        name: card.name,
        limit: card.limit,
        dueDate: card.dueDate,
        closingDate: card.closingDate,
      },
    });

    set((state) => ({
      cards: state.cards.map((existingCard) =>
        existingCard.id === cardId
          ? { ...existingCard, ...card }
          : existingCard,
      ),
    }));
  },

  toggleCardBlockedStatus: async (cardId, blocked) => {
    await toggleCardBlockedStatusUseCase.execute({ cardId, blocked });

    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, blocked } : card,
      ),
    }));
  },
});
