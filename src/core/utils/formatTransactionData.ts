import dayjs from "dayjs";

export function formatTransactionDate(
  date: any,
  format = "DD/MM/YYYY",
): string {
  return dayjs(date.seconds * 1000 + date.nanoseconds / 1e6).format(format);
}

export function transactionTimestampToDate(date: any): Date {
  return dayjs(date.seconds * 1000 + date.nanoseconds / 1e6).toDate();
}
