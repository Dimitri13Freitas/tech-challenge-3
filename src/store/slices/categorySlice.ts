import {
  addCustomCategory,
  getCombinedCategoriesService,
  removeCustomCategory,
} from "@core/api";
import {
  Category,
  CombinedCategoriesResult,
} from "@core/types/services/categories/categoryTypes";
import { AppStore } from "@store/useAppStore";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { StateCreator } from "zustand";

type CategoryType = "expense" | "income";

interface CategoryState {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  currentCategoryType: CategoryType;
  hasMoreCategories: boolean;
  lastStandardDoc: QueryDocumentSnapshot<DocumentData> | null;
  lastUserDoc: QueryDocumentSnapshot<DocumentData> | null;
  isRemoving: boolean;
}

interface CategoryActions {
  fetchCategories: (
    userId: string | null | undefined,
    type?: CategoryType,
    options?: {
      reset?: boolean;
      pageSize?: number;
    },
  ) => Promise<void>;
  addCategory: (
    userId: string,
    name: string,
    color: string,
    type: CategoryType,
  ) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  setCategoryType: (type: CategoryType) => void;
  resetCategories: () => void;
}

export type CategorySlice = CategoryState & CategoryActions;

const createInitialCategoryState = (): CategoryState => ({
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  currentCategoryType: "expense",
  hasMoreCategories: true,
  lastStandardDoc: null,
  lastUserDoc: null,
  isRemoving: false,
});

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Algo inesperado aconteceu.";
};

export const createCategorySlice: StateCreator<
  AppStore,
  [],
  [],
  CategorySlice
> = (set, get) => ({
  ...createInitialCategoryState(),

  fetchCategories: async (userId, type, options = {}) => {
    const { reset = false, pageSize = 10 } = options;
    // Se type não for passado, usa "all" para buscar todas as categorias
    const categoryType = type ?? "all";

    if (!userId) {
      set(() => ({
        categories: [],
        categoriesLoading: false,
        categoriesError: null,
        lastStandardDoc: null,
        lastUserDoc: null,
        hasMoreCategories: false,
      }));
      return;
    }

    const lastStandardDoc = reset ? null : get().lastStandardDoc;
    const lastUserDoc = reset ? null : get().lastUserDoc;

    set(() => ({
      categoriesLoading: true,
      categoriesError: null,
      ...(reset && {
        categories: [],
        lastStandardDoc: null,
        lastUserDoc: null,
        hasMoreCategories: true,
      }),
    }));

    try {
      const result: CombinedCategoriesResult =
        await getCombinedCategoriesService(
          userId,
          categoryType as "expense" | "income" | "all",
          pageSize,
          lastStandardDoc ?? undefined,
          lastUserDoc ?? undefined,
        );

      const hasMore =
        Boolean(result.lastStandardDoc) || Boolean(result.lastUserDoc);

      set((state) => ({
        // Só atualiza currentCategoryType se um type específico foi passado
        ...(type && { currentCategoryType: type }),
        categories: reset
          ? result.categories
          : [...state.categories, ...result.categories],
        lastStandardDoc: result.lastStandardDoc,
        lastUserDoc: result.lastUserDoc,
        hasMoreCategories: hasMore,
      }));
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
    } finally {
      set(() => ({ categoriesLoading: false }));
    }
  },

  addCategory: async (userId, name, color, type) => {
    try {
      await addCustomCategory(userId, name, color, type);
      await get().fetchCategories(userId, type, { reset: true });
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
      throw error;
    }
  },

  removeCategory: async (categoryId) => {
    try {
      set(() => ({ isRemoving: true }));
      await removeCustomCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter(
          (category) => category.id !== categoryId,
        ),
      }));
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
      throw error;
    } finally {
      set(() => ({ isRemoving: false }));
    }
  },

  setCategoryType: (type) => {
    set(() => ({ currentCategoryType: type }));
  },

  resetCategories: () => {
    set(() => ({
      ...createInitialCategoryState(),
    }));
  },
});
