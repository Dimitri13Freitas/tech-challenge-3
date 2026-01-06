import { Category } from "@core/types/services/categories/categoryTypes";
import { domainCategoriesToLegacy } from "@infrastructure/adapters/domainAdapters";
import {
  addCategoryUseCase,
  fetchCategoriesUseCase,
  removeCategoryUseCase,
  updateCategoryUseCase,
} from "@infrastructure/di/useCases";
import { AppStore } from "@store/useAppStore";
import { StateCreator } from "zustand";

type CategoryType = "expense" | "income";

interface CategoryState {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  currentCategoryType: CategoryType;
  hasMoreCategories: boolean;
  lastStandardDoc: unknown | null;
  lastUserDoc: unknown | null;
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
  updateCategory: (
    categoryId: string,
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

    const cursor = reset
      ? undefined
      : {
          lastStandardDoc: get().lastStandardDoc,
          lastUserDoc: get().lastUserDoc,
        };

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
      const result = await fetchCategoriesUseCase.execute({
        userId,
        type: categoryType as "expense" | "income" | "all",
        pageSize,
        cursor,
      });

      const legacyCategories = domainCategoriesToLegacy(result.categories);

      set((state) => ({
        ...(type && { currentCategoryType: type }),
        categories: reset
          ? legacyCategories
          : [...state.categories, ...legacyCategories],
        lastStandardDoc: result.pagination.lastStandardDoc,
        lastUserDoc: result.pagination.lastUserDoc,
        hasMoreCategories: result.hasMore,
      }));
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
    } finally {
      set(() => ({ categoriesLoading: false }));
    }
  },

  addCategory: async (userId, name, color, type) => {
    try {
      await addCategoryUseCase.execute({ userId, name, color, type });
      await get().fetchCategories(userId, type, { reset: true });
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
      throw error;
    }
  },

  updateCategory: async (categoryId, name, color, type) => {
    try {
      await updateCategoryUseCase.execute({ categoryId, name, color, type });
      // Atualizar a categoria localmente no store
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? { ...category, name, color, type }
            : category,
        ),
      }));
    } catch (error) {
      set(() => ({ categoriesError: getErrorMessage(error) }));
      throw error;
    }
  },

  removeCategory: async (categoryId) => {
    try {
      set(() => ({ isRemoving: true }));
      await removeCategoryUseCase.execute({ categoryId });
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
