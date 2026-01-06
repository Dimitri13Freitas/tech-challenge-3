import { Category, CategoryType } from "../../entities";
import { ICategoryRepository } from "../../repositories";

export interface UpdateCategoryRequest {
  categoryId: string;
  name: string;
  color: string;
  type: CategoryType;
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: UpdateCategoryRequest): Promise<Category> {
    const { categoryId, name, color, type } = request;

    if (!categoryId) {
      throw new Error("CategoryId é obrigatório");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório");
    }

    if (!["expense", "income"].includes(type)) {
      throw new Error('Tipo de categoria inválido. Deve ser "expense" ou "income".');
    }

    return await this.categoryRepository.updateCategory(
      categoryId,
      name.trim(),
      color,
      type,
    );
  }
}

