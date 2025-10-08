import { getCardsByUserId } from "@/services/firestore";
import { Card } from "@/types/services/cards/cardTypes";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CardsContextType {
  cards: Card[];
  loading: boolean;
  reloadCards: () => Promise<void>;
  updateCard: (updatedCard: Card) => void;
  addCard: (newCard: Card) => void;
  removeCard: (cardId: string) => void;
}

interface CardsProviderProps {
  children: React.ReactNode;
  userId?: string;
}

const CardsContext = createContext<CardsContextType | null>(null);

export const CardsProvider = ({ children, userId }: CardsProviderProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  const reloadCards = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const newCards = await getCardsByUserId(userId);
      setCards(newCards);
    } catch (error) {
      console.error("Erro ao recarregar cartões:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateCard = useCallback((updatedCard: Card) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card,
      ),
    );
  }, []);

  const addCard = useCallback((newCard: Card) => {
    setCards((prevCards) => [...prevCards, newCard]);
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  }, []);

  // Carrega os cartões quando o userId muda
  useEffect(() => {
    if (userId) {
      reloadCards();
    }
  }, [userId, reloadCards]);

  return (
    <CardsContext.Provider
      value={{
        cards,
        loading,
        reloadCards,
        updateCard,
        addCard,
        removeCard,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards deve ser usado dentro de CardsProvider");
  }
  return context;
};

