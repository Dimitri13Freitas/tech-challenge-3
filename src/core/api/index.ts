export * from "./firestore/balance";
export * from "./firestore/cards";
export * from "./firestore/categories";
export * from "./firestore/paymentMethods";
export * from "./firestore/reports";
export * from "./firestore/transactions";
export * from "./firestore/user";
// Exportar adaptadores de compatibilidade para transações
// export {
//   addTransactionAndUpdateBalance,
//   updateTransactionAndBalanceAdapter,
// } from "@infrastructure/adapters/transactionAdapters";
// Manter outras exportações de transactions que não foram migradas
// export { getTransactionsByMonth } from "./firestore/transactions";
