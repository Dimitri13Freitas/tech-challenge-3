import dayjs from "dayjs";

export function formatTransactionDate(
  date: any,
  format = "DD/MM/YYYY",
): string {
  if (!date) return "";

  // Se for um Timestamp do Firestore (tem a propriedade seconds)
  if (date.seconds !== undefined) {
    return dayjs(date.seconds * 1000 + (date.nanoseconds || 0) / 1e6).format(
      format,
    );
  }

  // Para Strings ISO ("2026-01-10T23:59:59.999Z") ou objetos Date
  return dayjs(date).format(format);
}

export function transactionTimestampToDate(
  date: string | number | Date | any,
): Date {
  // Se for a string ISO enviada, o dayjs converte diretamente
  // Se ainda houver chance de receber o objeto do Firebase, mantemos a lógica de fallback
  if (date?.seconds !== undefined) {
    return dayjs(date.seconds * 1000 + date.nanoseconds / 1e6).toDate();
  }

  return dayjs(date).toDate();
}
