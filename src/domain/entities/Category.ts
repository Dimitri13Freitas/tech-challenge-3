export type CategoryType = "expense" | "income";

export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isCustom: boolean,
    public readonly type?: CategoryType,
    public readonly color?: string,
    public readonly userId?: string,
  ) {
    this.validate();
  }

  static create(
    id: string,
    name: string,
    isCustom: boolean,
    type?: CategoryType,
    color?: string,
    userId?: string,
  ): Category {
    return new Category(id, name, isCustom, type, color, userId);
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error("Category ID é obrigatório");
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório");
    }

    if (this.isCustom && !this.userId) {
      throw new Error("Categorias customizadas devem ter um userId");
    }
  }

  isExpense(): boolean {
    return this.type === "expense";
  }

  isIncome(): boolean {
    return this.type === "income";
  }
}
