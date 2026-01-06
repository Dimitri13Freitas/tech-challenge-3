import { Category, CategoryType } from "@domain/entities";

export interface PaginationCursor {
  lastStandardDoc?: unknown;
  lastUserDoc?: unknown;
}

export interface FetchCategoriesResult {
  categories: Category[];
  pagination: PaginationCursor;
  hasMore: boolean;
}

export interface ICategoryRepository {
  fetchCategories(
    userId: string,
    type: CategoryType | "all",
    pageSize: number,
    cursor?: PaginationCursor,
  ): Promise<FetchCategoriesResult>;
  addCategory(
    userId: string,
    name: string,
    color: string,
    type: CategoryType,
  ): Promise<Category>;
  updateCategory(
    categoryId: string,
    name: string,
    color: string,
    type: CategoryType,
  ): Promise<Category>;
  removeCategory(categoryId: string): Promise<void>;
}
