import { Card } from "../../entities";
import { ICardRepository } from "../../repositories";

export interface GetCardsRequest {
  userId: string;
}

export class GetCardsUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(request: GetCardsRequest): Promise<Card[]> {
    const { userId } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    return await this.cardRepository.getCardsByUserId(userId);
  }
}

