export type TransactionType = "expense" | "income";

export type TransactionCategory = {
  id: string;
  isCustom: boolean;
  name: string;
};

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly valor: number,
    public readonly type: TransactionType,
    public readonly paymentMethod: string,
    public readonly category: TransactionCategory,
    public readonly date: Date,
    public readonly userId: string,
  ) {
    this.validate();
  }

  static create(
    id: string,
    valor: number,
    type: TransactionType,
    paymentMethod: string,
    category: TransactionCategory,
    date: Date,
    userId: string,
  ): Transaction {
    return new Transaction(
      id,
      valor,
      type,
      paymentMethod,
      category,
      date,
      userId,
    );
  }

  private validate(): void {
    if (this.valor <= 0) {
      throw new Error("Valor da transação deve ser maior que zero");
    }

    if (!["expense", "income"].includes(this.type)) {
      throw new Error('Tipo de transação deve ser "expense" ou "income"');
    }

    if (!this.paymentMethod || this.paymentMethod.trim().length === 0) {
      throw new Error("Método de pagamento é obrigatório");
    }

    if (!this.category) {
      throw new Error("Categoria é obrigatória");
    }

    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error("UserId é obrigatório");
    }

    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new Error("Data inválida");
    }
  }

  calculateBalanceDelta(): number {
    return this.type === "income" ? this.valor : -this.valor;
  }

  isExpense(): boolean {
    return this.type === "expense";
  }

  isIncome(): boolean {
    return this.type === "income";
  }
}
