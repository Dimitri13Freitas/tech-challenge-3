import { ManageCardItem } from "@/components/manage-cards/manage-card-item";
import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { staticColors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useCards } from "@/contexts/CardsContext";
import { useBottomSheet } from "@/hooks/BottomSheetHook";
import { useSnackbar } from "@/hooks/SnackBarHook";
import {
  addCard,
  toggleCardBlockedStatus,
  updateCard,
} from "@/services/firestore";
import { Card } from "@/types/services/cards/cardTypes";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Divider, IconButton, useTheme } from "react-native-paper";

// Formulário de Criação/Edição
interface CardFormData {
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}

export default function ManageCards() {
  const { colors } = useTheme();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { user } = useAuth();
  const { showMessage } = useSnackbar();
  const {
    cards,
    loading,
    reloadCards,
    updateCard: updateCardInContext,
  } = useCards();

  const params = useLocalSearchParams();
  const showMessageRef = useRef(showMessage);

  // Atualiza a ref sempre que showMessage muda
  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { isSubmitting: isCreating },
  } = useForm<CardFormData>({
    defaultValues: { name: "", limit: 0, dueDate: 0, closingDate: 0 },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { isSubmitting: isEditing },
  } = useForm<CardFormData>();

  // Recarrega os dados sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      // Só recarrega se não estiver carregando e se não vier via params
      if (!loading && !params.cardsJson) {
        reloadCards();
      }
    }, [loading, params.cardsJson, reloadCards]),
  );

  // --- Handlers de Ação ---
  const handleCreateCard = handleCreateSubmit(async (formData) => {
    if (!user?.uid) return;

    try {
      await addCard(
        user.uid,
        formData.name,
        formData.limit,
        formData.dueDate,
        formData.closingDate,
      );

      // Recarrega os cartões para pegar o novo cartão com ID
      reloadCards();

      showMessage("Cartão criado com sucesso!", "success");
      closeBottomSheet();
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      showMessage("Não foi possível criar o cartão.", "warning");
    }
  });

  // --- Conteúdos dos BottomSheets ---
  const BottomSheetCreateContent = useMemo(
    () => (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BytebankText
          variant="titleLarge"
          style={{ fontWeight: "bold", marginBottom: 15 }}
        >
          Criar Novo Cartão
        </BytebankText>

        <View style={{ gap: 10 }}>
          <BytebankTextInputController
            control={createControl}
            name="name"
            placeholder="Ex: Nubank Principal"
            label="Nome do cartão"
            rules={{ required: "Nome é obrigatório" }}
          />
          <BytebankTextInputController
            control={createControl}
            name="limit"
            placeholder="R$ 0,00"
            type="currency"
            label="Limite Total"
            rules={{ required: "Limite é obrigatório" }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <BytebankTextInputController
              control={createControl}
              name="closingDate"
              placeholder="Dia 1"
              label="Dia de Fechamento"
              type="number"
              rules={{
                required: "Fechamento é obrigatório",
                min: { value: 1, message: "Dia mínimo é 1" },
                max: { value: 31, message: "Dia máximo é 31" },
              }}
            />
            <BytebankTextInputController
              control={createControl}
              name="dueDate"
              placeholder="Dia 10"
              label="Dia de Vencimento"
              type="number"
              rules={{
                required: "Vencimento é obrigatório",
                min: { value: 1, message: "Dia mínimo é 1" },
                max: { value: 31, message: "Dia máximo é 31" },
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <BytebankButton
          onPress={handleCreateCard}
          loading={isCreating}
          disabled={isCreating}
          style={{ marginTop: 20 }}
        >
          Salvar Cartão
        </BytebankButton>

        <BytebankButton
          onPress={closeBottomSheet}
          mode="text"
          labelStyle={{ color: colors.outline }}
          style={{ marginTop: 10 }}
        >
          Cancelar
        </BytebankButton>
      </KeyboardAvoidingView>
    ),
    [
      createControl,
      handleCreateCard,
      isCreating,
      closeBottomSheet,
      colors.outline,
    ],
  );

  // --- Handlers de BottomSheet ---
  const openCreateBottomSheet = useCallback(() => {
    resetCreateForm();
    openBottomSheet(BottomSheetCreateContent);
  }, [resetCreateForm, openBottomSheet, BottomSheetCreateContent]);

  const openEditBottomSheet = useCallback(
    (card: Card) => {
      resetEditForm({
        name: card.name,
        limit: card.limit,
        dueDate: card.dueDate,
        closingDate: card.closingDate,
      });

      // Funções específicas para este cartão
      const handleUpdateThisCard = handleEditSubmit(async (formData) => {
        try {
          await updateCard(card.id, {
            name: formData.name,
            limit: formData.limit,
            dueDate: formData.dueDate,
            closingDate: formData.closingDate,
          });

          // Atualiza o cartão no contexto
          const updatedCard = {
            ...card,
            name: formData.name,
            limit: formData.limit,
            dueDate: formData.dueDate,
            closingDate: formData.closingDate,
          };
          updateCardInContext(updatedCard);

          showMessage("Cartão atualizado com sucesso!", "success");
          closeBottomSheet();
        } catch (error) {
          console.error("Erro ao atualizar cartão:", error);
          showMessage("Não foi possível atualizar o cartão.", "warning");
        }
      });

      const handleToggleThisCard = async () => {
        const newStatus = !card.blocked;

        try {
          await toggleCardBlockedStatus(card.id, newStatus);

          // Atualiza o cartão no contexto
          const updatedCard = {
            ...card,
            blocked: newStatus,
          };
          updateCardInContext(updatedCard);

          const statusText = newStatus ? "bloqueado" : "desbloqueado";
          showMessage(`Cartão ${statusText} com sucesso!`, "success");

          closeBottomSheet();
        } catch (error) {
          console.error("Erro ao alternar status do cartão:", error);
          showMessage(
            "Não foi possível alterar o status do cartão.",
            "warning",
          );
        }
      };

      // Cria o conteúdo do BottomSheet com o cartão atual
      const editContent = (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <BytebankText
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: 15 }}
          >
            Editar Cartão: {card.name}
          </BytebankText>

          <View style={{ gap: 10 }}>
            <BytebankTextInputController
              control={editControl}
              name="name"
              placeholder="Ex: Nubank Principal"
              label="Nome do cartão"
              rules={{ required: "Nome é obrigatório" }}
            />
            <BytebankTextInputController
              control={editControl}
              name="limit"
              placeholder="R$ 0,00"
              type="currency"
              label="Limite Total"
              rules={{ required: "Limite é obrigatório" }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <BytebankTextInputController
                control={editControl}
                name="closingDate"
                placeholder="Dia 1"
                label="Dia de Fechamento"
                type="number"
                rules={{
                  required: "Fechamento é obrigatório",
                  min: { value: 1, message: "Dia mínimo é 1" },
                  max: { value: 31, message: "Dia máximo é 31" },
                }}
                style={{ flex: 1 }}
              />
              <BytebankTextInputController
                control={editControl}
                name="dueDate"
                placeholder="Dia 10"
                label="Dia de Vencimento"
                type="number"
                rules={{
                  required: "Vencimento é obrigatório",
                  min: { value: 1, message: "Dia mínimo é 1" },
                  max: { value: 31, message: "Dia máximo é 31" },
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          {/* Botão de Bloqueio/Desbloqueio */}
          <BytebankButton
            onPress={handleToggleThisCard}
            mode="outlined"
            style={{
              marginTop: 20,
              borderColor: card.blocked ? staticColors.income : colors.error,
            }}
            labelStyle={{
              color: card.blocked ? staticColors.income : colors.error,
            }}
          >
            {card.blocked ? "Desbloquear Cartão" : "Bloquear Cartão"}
          </BytebankButton>

          <BytebankButton
            onPress={handleUpdateThisCard}
            loading={isEditing}
            disabled={isEditing}
            style={{ marginTop: 10 }}
          >
            Salvar Edição
          </BytebankButton>

          <BytebankButton
            onPress={closeBottomSheet}
            mode="text"
            labelStyle={{ color: colors.outline }}
            style={{ marginTop: 10 }}
          >
            Cancelar
          </BytebankButton>
        </KeyboardAvoidingView>
      );

      openBottomSheet(editContent);
    },
    [
      resetEditForm,
      openBottomSheet,
      editControl,
      isEditing,
      closeBottomSheet,
      colors.outline,
      colors.error,
      showMessage,
      updateCardInContext,
      handleEditSubmit,
    ],
  );

  const handleCardPress = useCallback(
    (card: Card) => {
      openEditBottomSheet(card);
    },
    [openEditBottomSheet],
  );

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
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => {
            router.back();
            closeBottomSheet();
          }}
        />
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
          onPress={openCreateBottomSheet}
        />
      </View>

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

        {loading ? (
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <>
                <ManageCardItem
                  card={item}
                  onPress={() => handleCardPress(item)}
                />
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
        )}
      </Container>
    </>
  );
}
