import { useAppStore } from "@/src/store/useAppStore";
import { router } from "expo-router";

export const navigateToManageCards = () => {
  router.push("/(tabs)/home/manage-cards");
};

export const useMyCardsLogic = () => {
  const { cardsLoading, cards, user } = useAppStore();

  const handleManageCardsPress = () => {
    navigateToManageCards();
  };

  return {
    cardsLoading,
    cards,
    user,
    handleManageCardsPress,
  };
};
