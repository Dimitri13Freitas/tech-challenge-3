import { Transaction } from "../../entities";
import { ITransactionRepository } from "../../repositories";

export interface AddTransactionRequest {
  userId: string;
  valor: number;
  type: "expense" | "income";
  paymentMethod: string;
  category: {
    id: string;
    name: string;
    isCustom: boolean;
  };
  date: Date;
}

export class AddTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: AddTransactionRequest): Promise<Transaction> {
    const { userId, valor, type, paymentMethod, category, date } = request;

    if (!userId) {
      throw new Error("UserId é obrigatório");
    }

    if (valor <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (!["expense", "income"].includes(type)) {
      throw new Error('Tipo de transação inválido. Use "income" ou "expense".');
    }

    const categoryEntity = {
      id: category.id,
      name: category.name,
      type: type as "expense" | "income",
      color: "#9E9E9E",
      isCustom: category.isCustom,
    };

    const transaction = Transaction.create(
      "",
      valor,
      type,
      paymentMethod,
      categoryEntity as any,
      date,
      userId,
    );

    const savedTransaction = await this.transactionRepository.addTransaction(
      transaction,
    );

    const balanceDelta = savedTransaction.calculateBalanceDelta();
    await this.transactionRepository.updateBalance(userId, balanceDelta);

    return savedTransaction;
  }
}
