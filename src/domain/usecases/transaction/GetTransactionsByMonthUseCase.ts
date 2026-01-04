import { Transaction } from "@domain/entities";
import { ITransactionRepository } from "@domain/repositories";

export interface GetTransactionsByMonthRequest {
  userId: string;
  year: number;
  month: number;
}

export class GetTransactionsByMonthUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    request: GetTransactionsByMonthRequest,
  ): Promise<Transaction[]> {
    const { userId, year, month } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    if (month < 1 || month > 12) {
      throw new Error("Mês deve estar entre 1 e 12");
    }

    return await this.transactionRepository.getTransactionsByMonth(
      userId,
      year,
      month,
    );
  }
}

