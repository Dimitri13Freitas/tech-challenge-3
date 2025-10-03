import { ManageCardItem } from "@/components/manage-cards/manage-card-item";
import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { useAuth } from "@/contexts/AuthContext";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { addCard } from "@/services/firestore";
import { Card } from "@/types/services/cards/cardTypes";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, FlatList, View } from "react-native";
import { Divider, IconButton, useTheme } from "react-native-paper";

interface CardFormData {
  name: string;
  limit: string;
  dueDate: string;
  closingDate: string;
}

export default function ManageCards() {
  const { colors } = useTheme();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { user } = useAuth();

  const params = useLocalSearchParams();

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (params.cardsJson && typeof params.cardsJson === "string") {
      try {
        const parsedCards: Card[] = JSON.parse(params.cardsJson);
        setCards(parsedCards);
      } catch (error) {
        console.error("Erro ao fazer parse dos cartões da rota:", error);
      }
    }
  }, [params.cardsJson]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CardFormData>({
    defaultValues: { name: "", limit: "", dueDate: "", closingDate: "" },
  });

  const handleCreateCard = handleSubmit(async (formData) => {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await addCard(
        user.uid,
        formData.name,
        parseFloat(formData.limit),
        parseInt(formData.dueDate, 10),
        parseInt(formData.closingDate, 10),
      );

      Alert.alert("Sucesso", "Cartão criado com sucesso!");
      reset();
      closeBottomSheet();
      // TODO: Recarregar a lista de cartões aqui (chamando getCardsByUserId)
      // Por enquanto, apenas atualizamos a UI com uma mensagem.
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      Alert.alert("Erro", "Não foi possível criar o cartão.");
    }
  });

  // 3. Conteúdo do Bottom Sheet para Criar Cartão
  const BottomSheetContent = useMemo(
    () => (
      <>
        <BytebankText
          variant="titleLarge"
          style={{ fontWeight: "bold", marginBottom: 15 }}
        >
          Criar Novo Cartão
        </BytebankText>

        <View style={{ gap: 10 }}>
          <BytebankTextInputController
            control={control}
            name="name"
            placeholder="Ex: Nubank Principal"
            label="Nome do cartão"
            rules={{ required: "Nome é obrigatório" }}
          />
          <BytebankTextInputController
            control={control}
            name="limit"
            placeholder="R$ 0,00"
            type="currency"
            label="Limite Total"
            rules={{ required: "Limite é obrigatório" }}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <BytebankTextInputController
              control={control}
              name="closingDate"
              placeholder="Dia 1"
              label="Dia de Fechamento"
              keyboardType="numeric"
              rules={{ required: "Dia de fechamento é obrigatório" }}
              style={{ flex: 1 }}
            />
            <BytebankTextInputController
              control={control}
              name="dueDate"
              placeholder="Dia 10"
              label="Dia de Vencimento"
              keyboardType="numeric"
              rules={{ required: "Dia de vencimento é obrigatório" }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
        <BytebankButton
          onPress={handleCreateCard}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: 20 }}
        >
          Salvar Cartão
        </BytebankButton>
      </>
    ),
    [control, handleCreateCard, isSubmitting],
  );

  // 4. Handler para clique no item da lista (Edição/Ações)
  const handleCardPress = (card: Card) => {
    console.log(
      `Abrir modal de Edição/Bloqueio para o cartão: ${card.name} (ID: ${card.id})`,
    );
    // TODO: Aqui você abriria um novo BottomSheet para Edição/Bloqueio
  };

  // 5. Renderização
  const cardCount = cards.length;

  return (
    <>
      <View
        style={{
          backgroundColor: colors.primaryContainer,
          paddingHorizontal: 16,
          paddingTop: 30,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <BytebankText
          variant="titleMedium"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Gerenciar Cartões
        </BytebankText>
        <IconButton
          icon="plus"
          mode="outlined"
          size={24}
          onPress={() => openBottomSheet(BottomSheetContent)}
        />
      </View>
      {/* --- Container (Corpo da Tela) --- */}
      <Container scrollable={false}>
        <View style={{ position: "relative" }}>
          <Divider />
          <BytebankText
            style={{
              position: "absolute",
              top: -10,
              alignSelf: "center",
              paddingHorizontal: 6,
              backgroundColor: colors.background,
              color: colors.outline,
            }}
          >
            {cardCount} Cartões
          </BytebankText>
        </View>

        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <>
              <ManageCardItem card={item} onPress={handleCardPress} />
              {index !== cards.length - 1 && <Divider />}
            </>
          )}
          ListEmptyComponent={() => (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <BytebankText style={{ color: colors.outline }}>
                Nenhum cartão cadastrado. Clique em + para adicionar.
              </BytebankText>
            </View>
          )}
          style={{ marginTop: 16 }}
        />
      </Container>
    </>
  );
}
