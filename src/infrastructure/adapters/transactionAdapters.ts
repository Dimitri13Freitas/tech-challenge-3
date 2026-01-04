import { Category, Transaction } from "@domain/entities";
import {
  addTransactionUseCase,
  updateTransactionUseCase,
} from "@infrastructure/di/useCases";

export async function addTransactionAndUpdateBalance(
  userId: string,
  transactionData: {
    valor: string;
    type: "expense" | "income";
    paymentMethod: string;
    category: {
      id: string;
      name: string;
      isCustom: boolean;
    };
    date: Date;
  },
): Promise<void> {
  const valor = parseFloat(transactionData.valor);

  await addTransactionUseCase.execute({
    userId,
    valor,
    type: transactionData.type,
    paymentMethod: transactionData.paymentMethod,
    category: transactionData.category,
    date: transactionData.date,
  });
}

export async function updateTransactionAndBalanceAdapter(
  userId: string,
  transactionId: string,
  oldTransactionData: {
    valor: string;
    type: "expense" | "income";
    paymentMethod: string;
    category: {
      id: string;
      name: string;
      isCustom: boolean;
    };
    date: Date | { seconds: number; nanoseconds?: number };
  },
  newTransactionData: {
    valor: string;
    type: "expense" | "income";
    paymentMethod: string;
    category: {
      id: string;
      name: string;
      isCustom: boolean;
    };
    date: Date;
  },
): Promise<void> {
  const oldValor = parseFloat(oldTransactionData.valor);
  const oldDate =
    oldTransactionData.date instanceof Date
      ? oldTransactionData.date
      : new Date((oldTransactionData.date as any).seconds * 1000);

  const oldCategory = Category.create(
    oldTransactionData.category.id,
    oldTransactionData.category.name,
    oldTransactionData.category.isCustom,
  );

  const oldTransaction = Transaction.create(
    transactionId,
    oldValor,
    oldTransactionData.type,
    oldTransactionData.paymentMethod,
    oldCategory,
    oldDate,
    userId,
  );

  const newValor = parseFloat(newTransactionData.valor);

  await updateTransactionUseCase.execute({
    userId,
    transactionId,
    oldTransaction,
    newTransactionData: {
      valor: newValor,
      type: newTransactionData.type,
      paymentMethod: newTransactionData.paymentMethod,
      category: newTransactionData.category,
      date: newTransactionData.date,
    },
  });
}
