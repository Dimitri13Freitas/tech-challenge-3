import { useAppStore } from "@/src/store/useAppStore";
import { router } from "expo-router";

export const useMyCardsLogic = () => {
  const { cardsLoading, cards, user } = useAppStore();

  const handleManageCardsPress = () => {
    router.push("/(tabs)/home/manage-cards");
  };

  return {
    cardsLoading,
    cards,
    user,
    handleManageCardsPress,
  };
};
