export * from "./firestore/balance";
export * from "./firestore/cards";
export * from "./firestore/categories";
export * from "./firestore/paymentMethods";
export * from "./firestore/reports";
// Exportar adaptadores de compatibilidade para transações
export {
  addTransactionAndUpdateBalance,
  updateTransactionAndBalance,
} from "@infrastructure/adapters/transactionAdapters";
// Manter outras exportações de transactions que não foram migradas
export { getTransactionsByMonth } from "./firestore/transactions";
export * from "./firestore/user";
