type FormatCurrencyOptions = {
  removeSymbol?: boolean;
  returnZeroIfNull?: boolean;
  cleanString?: boolean;
};

export function formatCurrencyBR(
  value: number | string | null | undefined,
  options: FormatCurrencyOptions = {},
): string {
  const {
    removeSymbol = false,
    returnZeroIfNull = false,
    cleanString = false,
  } = options;

  if (value === null || value === undefined || value === "") {
    return returnZeroIfNull ? "R$ 0,00" : "";
  }

  let num: number;

  if (typeof value === "string") {
    if (cleanString) {
      const digits = value.replace(/\D/g, "");
      num = digits ? Number(digits) / 100 : 0;
    } else {
      num = parseFloat(value);
    }
  } else {
    num = value;
  }

  if (isNaN(num)) return "";

  let formatted = num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (removeSymbol) {
    formatted = formatted.replace("R$", "").trim();
  }

  return formatted;
}
