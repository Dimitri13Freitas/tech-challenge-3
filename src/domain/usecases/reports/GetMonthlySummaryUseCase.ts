import { ITransactionRepository } from "@domain/repositories";
import dayjs from "dayjs";

export interface GetMonthlySummaryRequest {
  userId: string;
  year?: number;
  month?: number;
}

export class GetMonthlySummaryUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: GetMonthlySummaryRequest): Promise<number[] | null> {
    const { userId } = request;
    const now = dayjs();
    const year = request.year ?? now.year();
    const month = request.month ?? now.month() + 1;
    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    const transactions =
      await this.transactionRepository.getTransactionsByMonth(
        userId,
        year,
        month,
      );

    if (transactions.length === 0) return null;

    const summary = transactions.reduce(
      (acc, t) => {
        if (t.type === "income") acc[0] += t.valor;
        else if (t.type === "expense") acc[1] += t.valor;
        return acc;
      },
      [0, 0],
    );
    return summary;
  }
}
