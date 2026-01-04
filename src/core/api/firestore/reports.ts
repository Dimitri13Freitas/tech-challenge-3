// import { getExpensesByCategoryUseCase } from "@infrastructure/di/useCases";
// import dayjs from "dayjs";

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

// export interface CategoryExpenseData {
//   name: string;
//   value: number;
//   color: string;
// }

// // Re-exportar tipo para compatibilidade
// export type { CategoryExpenseData } from "@domain/usecases/reports";

// export const getExpensesByCategory = async (
//   userId: string,
//   year?: number,
//   month?: number,
// ): Promise<CategoryExpenseData[]> => {
//   try {
//     return await getExpensesByCategoryUseCase.execute({
//       userId,
//       year,
//       month,
//     });
//   } catch (error) {
//     console.error("Erro ao buscar dados do gráfico:", error);
//     throw new Error("Não foi possível carregar as despesas por categoria.");
//   }
// };
