export type CategoryType = "expense" | "income";

export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: CategoryType,
    public readonly color: string,
    public readonly isCustom: boolean,
    public readonly userId?: string,
  ) {
    this.validate();
  }

  static create(
    id: string,
    name: string,
    type: CategoryType,
    color: string,
    isCustom: boolean,
    userId?: string,
  ): Category {
    return new Category(id, name, type, color, isCustom, userId);
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error("Category ID é obrigatório");
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório");
    }

    if (!["expense", "income"].includes(this.type)) {
      throw new Error('Tipo de categoria deve ser "expense" ou "income"');
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
