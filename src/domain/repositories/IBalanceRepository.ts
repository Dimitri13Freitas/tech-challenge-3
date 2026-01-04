export interface IBalanceRepository {
  getBalance(userId: string): Promise<number>;
  updateBalance(userId: string, delta: number): Promise<void>;
  subscribeToBalance(
    userId: string,
    callback: (balance: number) => void,
  ): () => void;
}


