import { Category, CategoryType } from "../../entities";
import {
  FetchCategoriesResult,
  ICategoryRepository,
  PaginationCursor,
} from "../../repositories";

export interface FetchCategoriesRequest {
  userId: string;
  type?: CategoryType | "all";
  pageSize?: number;
  cursor?: PaginationCursor;
}

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: FetchCategoriesRequest): Promise<FetchCategoriesResult> {
    const { userId, type = "all", pageSize = 10, cursor } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    return await this.categoryRepository.fetchCategories(
      userId,
      type,
      pageSize,
      cursor,
    );
  }
}

