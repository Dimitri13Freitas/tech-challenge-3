import {
  BytebankButton,
  BytebankCard,
  BytebankText,
} from "@/src/core/components";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, useColorScheme, View } from "react-native";
import { ManageCardItem } from "../manage-cards/manage-card-item";
import { useMyCardsLogic } from "./actions";
import { NoCards } from "./no-cards";

export const MyCards = () => {
  const { cardsLoading, cards, handleManageCardsPress } = useMyCardsLogic();
  const colorScheme = useColorScheme();

  const renderContent = () => {
    if (cards.length === 0) {
      return <NoCards />;
    }

    return (
      <FlatList
        data={cards.slice(0, 2)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ManageCardItem card={item} />}
        contentContainerStyle={{ paddingBottom: 15 }}
        scrollEnabled={false}
      />
    );
  };

  return (
    <View>
      <BytebankCard>
        <BytebankText
          variant="titleLarge"
          style={{ fontWeight: "bold", marginBottom: 10 }}
        >
          Meus cartões
        </BytebankText>
        {renderContent()}
        <View
          style={{
            width: "100%",
            position: "absolute",
            bottom: 30,
          }}
        >
          {cards.length !== 0 && (
            <LinearGradient
              colors={[
                "transparent",
                colorScheme === "dark" ? "#292a1b" : "#f2f0e1",
              ]}
              style={{ width: "100%", height: 300 }}
            />
          )}
        </View>
        <BytebankButton
          onPress={handleManageCardsPress}
          style={{ marginTop: 5 }}
          disabled={cardsLoading}
        >
          Gerenciar Cartões
        </BytebankButton>
      </BytebankCard>
    </View>
  );
};
