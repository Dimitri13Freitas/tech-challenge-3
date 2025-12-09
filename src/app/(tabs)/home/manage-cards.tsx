import {
  BytebankButton,
  BytebankText,
  BytebankTextInputController,
  Container,
} from "@/src/core/components";
import { useBottomSheet, useSnackbar } from "@/src/core/hooks";
import { staticColors } from "@/src/core/theme/theme";
import { ManageCardItem } from "@/src/features";
import { useAppStore } from "@/src/store/useAppStore";
import { Card } from "@core/types/services/cards/cardTypes";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
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
  const {
    user,
    cards,
    cardsLoading: loading,
    addCard,
    updateCard,
    toggleCardBlockedStatus,
  } = useAppStore();
  const { showMessage } = useSnackbar();

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

  const handleCreateCard = handleCreateSubmit(async (formData) => {
    if (!user?.uid) return;

    try {
      await addCard(user.uid, { ...formData });

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

          // O updateCard já atualiza o estado na store automaticamente

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

          // O toggleCardBlockedStatus já atualiza o estado na store automaticamente

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
                <BytebankText
                  style={{ color: colors.outline, textAlign: "center" }}
                >
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
