import { Category, CategoryType } from "../../entities";
import { ICategoryRepository } from "../../repositories";

export interface AddCategoryRequest {
  userId: string;
  name: string;
  color: string;
  type: CategoryType;
}

export class AddCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: AddCategoryRequest): Promise<Category> {
    const { userId, name, color, type } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório");
    }

    if (!["expense", "income"].includes(type)) {
      throw new Error('Tipo de categoria inválido. Deve ser "expense" ou "income".');
    }

    return await this.categoryRepository.addCategory(userId, name.trim(), color, type);
  }
}

