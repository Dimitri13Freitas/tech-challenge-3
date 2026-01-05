import dayjs from "dayjs";

export function formatTransactionDate(
  date: any,
  format = "DD/MM/YYYY",
): string {
  if (!date) return "";

  if (date.seconds !== undefined) {
    return dayjs(date.seconds * 1000 + (date.nanoseconds || 0) / 1e6).format(
      format,
    );
  }

  return dayjs(date).format(format);
}

export function transactionTimestampToDate(
  date: string | number | Date | any,
): Date {
  if (date?.seconds !== undefined) {
    return dayjs(date.seconds * 1000 + date.nanoseconds / 1e6).toDate();
  }

  return dayjs(date).toDate();
}
