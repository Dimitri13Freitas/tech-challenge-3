export class Card {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly limit: number,
    public readonly blocked: boolean,
    public readonly dueDate: number,
    public readonly closingDate: number,
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  static create(
    id: string,
    userId: string,
    name: string,
    limit: number,
    blocked: boolean,
    dueDate: number,
    closingDate: number,
    createdAt: Date,
  ): Card {
    return new Card(id, userId, name, limit, blocked, dueDate, closingDate, createdAt);
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error("Card ID é obrigatório");
    }

    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error("UserId é obrigatório");
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome do cartão é obrigatório");
    }

    if (this.limit < 0) {
      throw new Error("Limite do cartão não pode ser negativo");
    }

    if (this.dueDate < 1 || this.dueDate > 31) {
      throw new Error("Dia de vencimento deve estar entre 1 e 31");
    }

    if (this.closingDate < 1 || this.closingDate > 31) {
      throw new Error("Dia de fechamento deve estar entre 1 e 31");
    }

    if (!(this.createdAt instanceof Date) || isNaN(this.createdAt.getTime())) {
      throw new Error("Data de criação inválida");
    }
  }

  isBlocked(): boolean {
    return this.blocked;
  }

  getAvailableLimit(): number {
    return this.blocked ? 0 : this.limit;
  }
}

