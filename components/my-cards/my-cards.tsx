import { useCards } from "@/contexts/CardsContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import { ManageCardItem } from "../manage-cards/manage-card-item";
import { BytebankButton } from "../ui/button/button";
import { BytebankCard } from "../ui/card/card";
import { BytebankText } from "../ui/text/text";

const NoCards = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 20 }}>
      <View
        style={{
          backgroundColor: colors.elevation.level5,
          borderRadius: 10,
        }}
      >
        <AntDesign
          name="credit-card"
          size={42}
          color={colors.outline}
          style={{ paddingHorizontal: 15, paddingVertical: 8 }}
        />
      </View>
      <BytebankText
        style={{
          maxWidth: "60%",
          textAlign: "center",
          marginVertical: 15,
          color: colors.outline,
        }}
      >
        Adicione um novo cartão de crédito a sua conta
      </BytebankText>
    </View>
  );
};

export const MyCards = () => {
  const { cards, loading } = useCards();
  const { colors } = useTheme();

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          style={{ marginVertical: 40 }}
          color={colors.primary}
        />
      );
    }

    if (cards.length === 0) {
      return <NoCards />;
    }

    return (
      <FlatList
        data={cards}
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
          variant="titleMedium"
          style={{ fontWeight: "bold", marginBottom: 10 }}
        >
          Meus cartões
        </BytebankText>
        {renderContent()}
        <BytebankButton
          onPress={() => {
            router.push({
              pathname: "/manage-cards",
              params: { cardsJson: JSON.stringify(cards) },
            });
          }}
          style={{ marginTop: 5 }}
          disabled={loading}
        >
          Gerenciar Cartões
        </BytebankButton>
      </BytebankCard>
    </View>
  );
};
