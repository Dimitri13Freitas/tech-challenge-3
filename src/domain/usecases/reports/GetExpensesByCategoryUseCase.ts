import { ICategoryRepository, ITransactionRepository } from "../../repositories";

export interface CategoryExpenseData {
  name: string;
  value: number;
  color: string;
}

export interface GetExpensesByCategoryRequest {
  userId: string;
  year?: number;
  month?: number;
}

export class GetExpensesByCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    request: GetExpensesByCategoryRequest,
  ): Promise<CategoryExpenseData[]> {
    const { userId, year, month } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    const DEFAULT_CATEGORY_COLOR = "#9E9E9E";

    // Buscar todas as categorias de despesa
    const categoriesResult = await this.categoryRepository.fetchCategories(
      userId,
      "expense",
      1000,
    );

    // Criar mapa de cores das categorias
    const categoryColorMap: Record<string, string> = {};
    categoriesResult.categories.forEach((category) => {
      categoryColorMap[category.name] =
        category.color || DEFAULT_CATEGORY_COLOR;
    });

    // Buscar transações do mês
    const targetDate = new Date();
    if (year && month) {
      targetDate.setFullYear(year);
      targetDate.setMonth(month - 1);
    }

    const transactions = await this.transactionRepository.getTransactionsByMonth(
      userId,
      year || targetDate.getFullYear(),
      month || targetDate.getMonth() + 1,
    );

    // Filtrar apenas despesas e agrupar por categoria
    const categoryMap: Record<string, number> = {};

    transactions
      .filter((t) => t.isExpense())
      .forEach((transaction) => {
        const categoryName = transaction.category.name || "Outros";
        const amount = transaction.valor;

        if (categoryMap[categoryName]) {
          categoryMap[categoryName] += amount;
        } else {
          categoryMap[categoryName] = amount;
        }
      });

    // Converter para formato de saída
    const result: CategoryExpenseData[] = Object.keys(categoryMap).map(
      (categoryName) => {
        const totalAmount = categoryMap[categoryName];
        const categoryColor =
          categoryColorMap[categoryName] || DEFAULT_CATEGORY_COLOR;
        return {
          name: categoryName,
          value: totalAmount,
          color: categoryColor,
        };
      },
    );

    // Ordenar por valor (maior para menor)
    result.sort((a, b) => b.value - a.value);

    return result;
  }
}

