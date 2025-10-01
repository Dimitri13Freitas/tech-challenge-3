import { CategoryTabs } from "@/components/category-tabs/category-tabs";
import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import FadeInView from "@/components/ui/fade-in-view/fade-in-view";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { useAuth } from "@/contexts/AuthContext";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { useSnackbar } from "@/contexts/SnackBarContext";
import {
  addCustomCategory,
  getCombinedCategories,
  removeCustomCategory,
} from "@/services/firestore";
import { Category } from "@/types/services/firestore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Dialog, IconButton, Portal, useTheme } from "react-native-paper";

type NewCategoryFormData = {
  category: string;
};

export default function CreateCategory() {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { user } = useAuth();
  const { showMessage } = useSnackbar();

  const [tab, setTab] = React.useState<"expense" | "income">("expense");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const { colors } = useTheme();
  const fetchIdRef = React.useRef(0);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewCategoryFormData>();

  const [lastStandardDoc, setLastStandardDoc] = React.useState<any>(null);
  const [lastUserDoc, setLastUserDoc] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  const promptRemoveCategory = (item: Category) => {
    setCategoryToDelete(item);
    setShowDeleteDialog(true);
  };

  const executeRemoveCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsRemoving(true);
      setShowDeleteDialog(false);
      await removeCustomCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      await loadData(true);
    } catch (error) {
      alert("Erro ao remover categoria. Tente novamente.");
      console.error("Erro na remoção da categoria: ", error);
    } finally {
      setIsRemoving(false);
    }
  };

  async function loadData(reset = false) {
    if (!user?.uid) return;
    const currentFetchId = ++fetchIdRef.current;
    if (reset) {
      setLoading(true);
      setCategories([]);
      setLastStandardDoc(null);
      setLastUserDoc(null);
    }
    const {
      categories: newCategories,
      lastStandardDoc: newStd,
      lastUserDoc: newUser,
    } = await getCombinedCategories(
      user.uid,
      tab,
      10,
      reset ? null : lastStandardDoc,
      reset ? null : lastUserDoc,
    );
    if (currentFetchId === fetchIdRef.current) {
      setCategories((prev) =>
        reset ? newCategories : [...prev, ...newCategories],
      );
      setLastStandardDoc(newStd);
      setLastUserDoc(newUser);
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddCategory = async (data: NewCategoryFormData) => {
    if (!user?.uid) return;
    try {
      await addCustomCategory(user.uid, data.category.trim(), tab);
      reset();
      closeBottomSheet();
      showMessage("CAtegoria adicionada com sucesso!", "success");
      await loadData(true);
    } catch (error) {
      alert("Erro ao adicionar categoria. Tente novamente.");
      console.error("Erro ao adicionar categoria customizada: ", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadData(true);
    }
  }, [tab, user?.uid]);

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
            openBottomSheet(BottomSheetContent);
          }}
        />
      </View>
      <Container scrollable={false} style={{ paddingTop: 20 }}>
        <CategoryTabs value={tab} onChange={setTab} />
        {loading ? (
          <View>
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={{
                  height: 65,
                  width: "100%",
                  marginBottom: 12,
                  borderRadius: 4,
                  backgroundColor: colors.backdrop,
                }}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.3}
            contentContainerStyle={{ paddingTop: 20 }}
            onEndReached={() => {
              if (!loadingMore && (lastStandardDoc || lastUserDoc)) {
                setLoadingMore(true);
                loadData();
              }
            }}
            renderItem={({ item, index }) => (
              <FadeInView delay={index * 50}>
                <View
                  style={{
                    borderColor: colors.surfaceVariant,
                    borderBottomWidth: 1,
                    borderTopWidth: index === 0 ? 1 : 0,
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <BytebankText variant="titleMedium">
                      {item.name}
                    </BytebankText>
                    <IconButton
                      style={item.isCustom ? null : { opacity: 0 }}
                      icon="delete"
                      disabled={!item.isCustom}
                      iconColor={colors.error}
                      size={20}
                      onPress={() => promptRemoveCategory(item)}
                    />
                  </View>
                </View>
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
