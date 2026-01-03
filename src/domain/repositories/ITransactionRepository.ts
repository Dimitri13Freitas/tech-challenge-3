import { Transaction } from "../entities";

export interface ITransactionRepository {
  addTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransaction(transactionId: string, transaction: Partial<Transaction>): Promise<void>;
  getTransactionsByMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<Transaction[]>;
  updateBalance(userId: string, delta: number): Promise<void>;
}

