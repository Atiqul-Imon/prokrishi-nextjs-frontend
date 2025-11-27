export function formatAmount(
  value: number | string | null | undefined,
  options?: { decimals?: number },
): string {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const decimals = options?.decimals ?? 2;
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numericValue)) {
    return "0";
  }

  const isWholeNumber = Number.isInteger(numericValue);
  const fractionDigits = isWholeNumber ? 0 : decimals;

  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

