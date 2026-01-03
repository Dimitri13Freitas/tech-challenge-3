import { ICardRepository } from "../../repositories";

export interface ToggleCardBlockedStatusRequest {
  cardId: string;
  blocked: boolean;
}

export class ToggleCardBlockedStatusUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(request: ToggleCardBlockedStatusRequest): Promise<void> {
    const { cardId, blocked } = request;

    if (!cardId) {
      throw new Error("CardId é obrigatório");
    }

    await this.cardRepository.toggleBlockedStatus(cardId, blocked);
  }
}

