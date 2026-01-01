import { getCombinedCategoriesService } from "@core/api/firestore/categories";
import { db } from "@core/firebase/config";
import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getMonthlySummary = async (
  userId: string,
  year?: number,
  month?: number,
): Promise<number[] | null> => {
  try {
    let targetDate = dayjs();

    if (year && month) {
      targetDate = dayjs()
        .set("year", year)
        .set("month", month - 1);
    }
    const startOfMonth = targetDate.startOf("month").toDate();
    const endOfMonth = targetDate.endOf("month").toDate();

    const transactionsRef = collection(db, `users/${userId}/transactions`);

    const q = query(
      transactionsRef,
      where("date", ">=", startOfMonth),
      where("date", "<=", endOfMonth),
    );

    const querySnapshot = await getDocs(q);

    let totalIncome = 0;
    let totalExpense = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const amount = Number(data.valor);
      const type = data.type;

      if (type === "income") {
        totalIncome += amount;
      } else if (type === "expense") {
        totalExpense += amount;
      }
    });

    if (totalExpense && totalIncome) {
      return [totalIncome, totalExpense];
    }
    return null;
  } catch (error) {
    console.error("Erro ao calcular resumo mensal:", error);
    throw new Error("Não foi possível carregar o resumo financeiro.");
  }
};

export interface CategoryExpenseData {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_CATEGORY_COLOR = "#9E9E9E";

export const getExpensesByCategory = async (
  userId: string,
  year?: number,
  month?: number,
): Promise<CategoryExpenseData[]> => {
  try {
    let targetDate = dayjs();
    if (year && month) {
      targetDate = dayjs()
        .set("year", year)
        .set("month", month - 1);
    }

    const startOfMonth = targetDate.startOf("month").toDate();
    const endOfMonth = targetDate.endOf("month").toDate();

    const categoriesResult = await getCombinedCategoriesService(
      userId,
      "expense",
      1000,
    );

    const categoryColorMap: Record<string, string> = {};
    categoriesResult.categories.forEach((category) => {
      categoryColorMap[category.name] =
        category.color || DEFAULT_CATEGORY_COLOR;
    });

    const transactionsRef = collection(db, `users/${userId}/transactions`);
    const q = query(
      transactionsRef,
      where("date", ">=", startOfMonth),
      where("date", "<=", endOfMonth),
      where("type", "==", "expense"),
    );

    const querySnapshot = await getDocs(q);

    const categoryMap: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data);
      const amount = Number(data.valor);
      const categoryName = data.category.name || "Outros";

      if (categoryMap[categoryName]) {
        categoryMap[categoryName] += amount;
      } else {
        categoryMap[categoryName] = amount;
      }
    });

    const result: CategoryExpenseData[] = Object.keys(categoryMap).map(
      (category) => {
        const totalAmount = categoryMap[category];
        const categoryColor =
          categoryColorMap[category] || DEFAULT_CATEGORY_COLOR;
        return {
          name: category,
          value: totalAmount,
          color: categoryColor,
        };
      },
    );

    result.sort((a, b) => b.value - a.value);

    console.log(
      `Dados carregados para o gráfico: ${result.length} categorias.`,
    );

    return result;
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    throw new Error("Não foi possível carregar as despesas por categoria.");
  }
};
