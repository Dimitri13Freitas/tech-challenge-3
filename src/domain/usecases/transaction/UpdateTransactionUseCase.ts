import { Transaction } from "@domain/entities";
import { ITransactionRepository } from "@domain/repositories";

export interface UpdateTransactionRequest {
  userId: string;
  transactionId: string;
  oldTransaction: Transaction;
  newTransactionData: {
    valor?: number;
    type?: "expense" | "income";
    paymentMethod?: string;
    category?: {
      id: string;
      name: string;
      isCustom: boolean;
    };
    date?: Date;
  };
}

export class UpdateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: UpdateTransactionRequest): Promise<void> {
    const { userId, transactionId, oldTransaction, newTransactionData } =
      request;

    if (!userId || !transactionId) {
      throw new Error("UserId e TransactionId são obrigatórios");
    }

    const oldDelta = oldTransaction.calculateBalanceDelta();

    const updatedCategory = newTransactionData.category || {
      id: oldTransaction.category.id,
      name: oldTransaction.category.name,
      isCustom: oldTransaction.category.isCustom,
    };

    const newTransaction = Transaction.create(
      transactionId,
      newTransactionData.valor ?? oldTransaction.valor,
      newTransactionData.type ?? oldTransaction.type,
      newTransactionData.paymentMethod ?? oldTransaction.paymentMethod,
      {
        ...oldTransaction.category,
        id: updatedCategory.id,
        name: updatedCategory.name,
        isCustom: updatedCategory.isCustom,
      } as any,
      newTransactionData.date ?? oldTransaction.date,
      userId,
    );

    const newDelta = newTransaction.calculateBalanceDelta();
    const balanceDelta = newDelta - oldDelta;

    await this.transactionRepository.updateTransaction(transactionId, {
      userId: userId,
      valor: newTransaction.valor,
      type: newTransaction.type,
      paymentMethod: newTransaction.paymentMethod,
      category: newTransaction.category,
      date: newTransaction.date,
    } as any);

    if (balanceDelta !== 0) {
      await this.transactionRepository.updateBalance(userId, balanceDelta);
    }
  }
}
