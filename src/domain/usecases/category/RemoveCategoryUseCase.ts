import { ICategoryRepository } from "../../repositories";

export interface RemoveCategoryRequest {
  categoryId: string;
}

export class RemoveCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: RemoveCategoryRequest): Promise<void> {
    const { categoryId } = request;

    if (!categoryId) {
      throw new Error("CategoryId é obrigatório");
    }

    await this.categoryRepository.removeCategory(categoryId);
  }
}

