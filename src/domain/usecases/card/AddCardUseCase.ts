import { Card } from "../../entities";
import { ICardRepository } from "../../repositories";

export interface AddCardRequest {
  userId: string;
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}

export class AddCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(request: AddCardRequest): Promise<Card> {
    const { userId, name, limit, dueDate, closingDate } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Nome do cartão é obrigatório");
    }

    if (limit <= 0) {
      throw new Error("Limite deve ser maior que zero");
    }

    if (closingDate < 1 || closingDate > 31) {
      throw new Error("O dia de fechamento deve ser entre 1 e 31.");
    }

    if (dueDate < 1 || dueDate > 31) {
      throw new Error("O dia de vencimento deve ser entre 1 e 31.");
    }

    return await this.cardRepository.addCard(userId, {
      name: name.trim(),
      limit,
      dueDate,
      closingDate,
    });
  }
}

