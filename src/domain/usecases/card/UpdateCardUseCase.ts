import { ICardRepository } from "../../repositories";

export interface UpdateCardRequest {
  cardId: string;
  data: {
    name?: string;
    limit?: number;
    dueDate?: number;
    closingDate?: number;
  };
}

export class UpdateCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(request: UpdateCardRequest): Promise<void> {
    const { cardId, data } = request;

    if (!cardId) {
      throw new Error("CardId é obrigatório");
    }

    if (data.closingDate !== undefined && (data.closingDate < 1 || data.closingDate > 31)) {
      throw new Error("O dia de fechamento deve ser entre 1 e 31.");
    }

    if (data.dueDate !== undefined && (data.dueDate < 1 || data.dueDate > 31)) {
      throw new Error("O dia de vencimento deve ser entre 1 e 31.");
    }

    await this.cardRepository.updateCard(cardId, data);
  }
}

