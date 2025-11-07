/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирование числа как валюты (с разделителями тысяч)
 */
export function formatCurrency(
  amount: number,
  currency: string = "₽",
  decimals: number = 2
): string {
  const formatted = amount.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${formatted} ${currency}`;
}

/**
 * Форматирование периода времени
 */
export function formatPeriod(
  years: number,
  months: number
): string {
  const parts: string[] = [];

  if (years > 0) {
    const yearWord = getYearWord(years);
    parts.push(`${years} ${yearWord}`);
  }

  if (months > 0) {
    const monthWord = getMonthWord(months);
    parts.push(`${months} ${monthWord}`);
  }

  return parts.length > 0 ? parts.join(" ") : "0 месяцев";
}

/**
 * Получение правильного склонения слова "год"
 */
function getYearWord(years: number): string {
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "лет";
  }

  if (lastDigit === 1) {
    return "год";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "года";
  }

  return "лет";
}

/**
 * Получение правильного склонения слова "месяц"
 */
function getMonthWord(months: number): string {
  const lastDigit = months % 10;
  const lastTwoDigits = months % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "месяцев";
  }

  if (lastDigit === 1) {
    return "месяц";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "месяца";
  }

  return "месяцев";
}

/**
 * Форматирование процентной ставки
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  return `${rate.toFixed(decimals)}%`;
}

