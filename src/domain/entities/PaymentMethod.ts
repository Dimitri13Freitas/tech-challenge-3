export type PaymentMethodType = "income" | "expense";

export class PaymentMethod {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: PaymentMethodType,
  ) {}

  static create(id: string, name: string, type: PaymentMethodType): PaymentMethod {
    return new PaymentMethod(id, name, type);
  }

  isForIncome(): boolean {
    return this.type === "income";
  }

  isForExpense(): boolean {
    return this.type === "expense";
  }
}


