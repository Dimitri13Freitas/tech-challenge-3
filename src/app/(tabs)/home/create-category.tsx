import {
  BytebankButton,
  BytebankCard,
  BytebankText,
  BytebankTextInputController,
  Container,
  FadeInView,
} from "@/src/core/components";
import { useGlobalBottomSheet, useSnackbar } from "@/src/core/hooks";
import { CategoryTabs } from "@/src/features";
import { Category } from "@core/types/services";
import { generateRandomColor } from "@core/utils/randomColor";
import { useAppStore } from "@store/useAppStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Dialog, IconButton, Portal, useTheme } from "react-native-paper";

interface NewCategoryFormData {
  category: string;
}

interface EditCategoryFormData {
  name: string;
}

export default function CreateCategory() {
  const { open, close } = useGlobalBottomSheet();
  const { user } = useAppStore();
  const { showMessage } = useSnackbar();
  const { colors } = useTheme();
  const {
    categories,
    categoriesLoading,
    isRemoving,
    hasMoreCategories,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,
    setCategoryType,
  } = useAppStore();

  const [tab, setTab] = React.useState<"expense" | "income">("expense");
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = React.useState<Category | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewCategoryFormData>();

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { isSubmitting: isEditing },
  } = useForm<EditCategoryFormData>();

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) => category.type === tab);
  }, [categories, tab]);

  const promptRemoveCategory = (item: Category) => {
    setCategoryToDelete(item);
    setShowDeleteDialog(true);
  };

  const executeRemoveCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setShowDeleteDialog(false);
      await removeCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      showMessage("Categoria removida com sucesso!", "success");
    } catch (error) {
      alert("Erro ao remover categoria. Tente novamente.");
      console.error("Erro na remoção da categoria: ", error);
    }
  };

  const loadMoreCategories = async () => {
    if (!user?.uid || loadingMore || !hasMoreCategories) return;
    try {
      setLoadingMore(true);
      await fetchCategories(user.uid, undefined, { reset: false });
    } catch (error) {
      console.error("Erro ao carregar mais categorias: ", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddCategory = async (data: NewCategoryFormData) => {
    if (!user?.uid) return;
    try {
      await addCategory(
        user.uid,
        data.category.trim(),
        generateRandomColor(),
        tab,
      );
      reset();
      close();
      showMessage("Categoria adicionada com sucesso!", "success");
      await fetchCategories(user.uid, undefined, { reset: true });
    } catch (error) {
      alert("Erro ao adicionar categoria. Tente novamente.");
      console.error("Erro ao adicionar categoria customizada: ", error);
    }
  };

  const handleEditCategory = async (data: EditCategoryFormData) => {
    if (!categoryToEdit) return;
    try {
      await updateCategory(
        categoryToEdit.id,
        data.name.trim(),
        categoryToEdit.color || "#9E9E9E", // Mantém a cor original
        categoryToEdit.type,
      );
      resetEdit();
      close();
      setCategoryToEdit(null);
      showMessage("Categoria atualizada com sucesso!", "success");
      if (user?.uid) {
        await fetchCategories(user.uid, undefined, { reset: true });
      }
    } catch (error) {
      alert("Erro ao atualizar categoria. Tente novamente.");
      console.error("Erro ao atualizar categoria: ", error);
    }
  };

  const openEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setEditValue("name", category.name);
    open({
      snapPoints: ["70%"],
      content: EditBottomSheetContent,
    });
  };

  const handleTabChange = (newTab: "expense" | "income") => {
    setTab(newTab);
    setCategoryType(newTab);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCategories(user.uid, undefined, { reset: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const BottomSheetContent = (
    <>
      <BytebankText
        variant="titleLarge"
        style={{ fontWeight: "bold", marginBottom: 15 }}
      >
        Criação de categoria - ({tab === "expense" ? "Despesas" : "Receitas"})
      </BytebankText>
      <BytebankTextInputController
        control={control}
        name="category"
        placeholder="Digite sua nova categoria"
        rules={{ required: "Preencha o campo" }}
      />
      <BytebankButton
        style={{ marginTop: 15 }}
        onPress={handleSubmit(handleAddCategory)}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adicionando..." : "Adicionar"}
      </BytebankButton>
    </>
  );

  const EditBottomSheetContent = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <BytebankText
        variant="titleLarge"
        style={{ fontWeight: "bold", marginBottom: 15 }}
      >
        Editar categoria
      </BytebankText>
      {categoryToEdit && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 15,
            padding: 12,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: categoryToEdit.color || "#9E9E9E",
              borderRadius: 15,
            }}
          />
          <BytebankText variant="bodyMedium" style={{ color: colors.outline }}>
            Cor: {categoryToEdit.color || "#9E9E9E"}
          </BytebankText>
        </View>
      )}
      <BytebankTextInputController
        control={editControl}
        name="name"
        placeholder="Nome da categoria"
        rules={{ required: "Preencha o campo" }}
      />
      <BytebankButton
        style={{ marginTop: 15 }}
        onPress={handleEditSubmit(handleEditCategory)}
        loading={isEditing}
        disabled={isEditing}
      >
        {isEditing ? "Salvando..." : "Salvar"}
      </BytebankButton>
    </KeyboardAvoidingView>
  );

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
          size={20}
          onPress={() => router.push("/(tabs)/home")}
        />
        <BytebankText
          variant="titleMedium"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Categorias
        </BytebankText>
        <IconButton
          icon="plus"
          mode="outlined"
          size={20}
          onPress={async () => {
            reset();
            open({
              snapPoints: ["50%"],
              content: BottomSheetContent,
            });
          }}
        />
      </View>
      <Container scrollable={false} style={{ paddingTop: 20 }}>
        <CategoryTabs value={tab} onChange={handleTabChange} />
        {categoriesLoading && categories.length === 0 ? (
          <View>
            {[...Array(6)].map((_, i) => (
              <BytebankCard style={{ height: 70 }} key={i}>
                <View></View>
              </BytebankCard>
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) =>
              `${item.id}-${new Date().getMilliseconds()}`
            }
            onEndReachedThreshold={0.3}
            contentContainerStyle={{ paddingTop: 20 }}
            renderItem={({ item, index }) => (
              <FadeInView delay={index * 50}>
                <BytebankCard>
                  <TouchableOpacity
                    disabled={!item.isCustom}
                    onPress={() => {
                      if (item.isCustom) {
                        openEditCategory(item);
                      }
                    }}
                    activeOpacity={item.isCustom ? 0.7 : 1}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          gap: 16,
                        }}
                      >
                        <View
                          style={{
                            width: 30,
                            height: 20,
                            backgroundColor: item.color,
                            borderRadius: 16,
                          }}
                        ></View>
                        <BytebankText variant="titleMedium">
                          {item.name}
                        </BytebankText>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <IconButton
                          style={item.isCustom ? null : { opacity: 0 }}
                          icon="delete"
                          disabled={!item.isCustom}
                          iconColor={colors.error}
                          onPress={(e) => {
                            e.stopPropagation();
                            promptRemoveCategory(item);
                          }}
                          size={20}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </BytebankCard>
              </FadeInView>
            )}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginVertical: 10 }}
                />
              ) : null
            }
          />
        )}
      </Container>
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <BytebankText>
              Tem certeza que deseja remover a categoria &quot;
              <BytebankText style={{ fontWeight: "bold" }}>
                {categoryToDelete?.name}
              </BytebankText>
              &quot;? Esta ação não pode ser desfeita.
            </BytebankText>
          </Dialog.Content>
          <Dialog.Actions>
            <BytebankButton
              onPress={() => setShowDeleteDialog(false)}
              mode="text"
            >
              Cancelar
            </BytebankButton>
            <BytebankButton
              onPress={executeRemoveCategory}
              loading={isRemoving}
              disabled={isRemoving}
              mode="contained"
              buttonColor={colors.error}
            >
              Remover
            </BytebankButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
