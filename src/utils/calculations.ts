/**
 * Утилиты для расчета инвестиций
 */

/**
 * Результат расчета будущей стоимости
 */
export interface FutureValueResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: MonthlyDataPoint[];
}

/**
 * Точка данных для графика по месяцам
 */
export interface MonthlyDataPoint {
  month: number;
  balance: number;
  invested: number;
  interest: number;
}

/**
 * Параметры для расчета будущей стоимости
 */
export interface FutureValueParams {
  initialCapital: number;
  monthlyContribution: number;
  annualRate: number;
  months: number;
}

/**
 * Расчет будущей стоимости с учетом сложного процента
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
export function calculateFutureValue({
  initialCapital,
  monthlyContribution,
  annualRate,
  months,
}: FutureValueParams): FutureValueResult {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyData: MonthlyDataPoint[] = [];

  let balance = initialCapital;
  let totalInvested = initialCapital;

  // Расчет по месяцам для графика
  for (let month = 1; month <= months; month++) {
    const interestForMonth = balance * monthlyRate;
    balance = balance + interestForMonth + monthlyContribution;
    totalInvested += monthlyContribution;

    monthlyData.push({
      month,
      balance: Math.round(balance * 100) / 100,
      invested: Math.round(totalInvested * 100) / 100,
      interest: Math.round((balance - totalInvested) * 100) / 100,
    });
  }

  const finalAmount = balance;
  const totalInterest = finalAmount - totalInvested;

  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyData,
  };
}

/**
 * Параметры для расчета времени до цели
 */
export interface TimeToGoalParams {
  initialCapital: number;
  monthlyContribution: number;
  annualRate: number;
  targetAmount: number;
}

/**
 * Результат расчета времени до цели
 */
export interface TimeToGoalResult {
  months: number;
  years: number;
  remainingMonths: number;
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: MonthlyDataPoint[];
}

/**
 * Расчет времени, необходимого для достижения целевой суммы
 * Использует итеративный метод
 */
export function calculateTimeToGoal({
  initialCapital,
  monthlyContribution,
  annualRate,
  targetAmount,
}: TimeToGoalParams): TimeToGoalResult | null {
  // Проверка достижимости цели
  if (initialCapital >= targetAmount) {
    const result = calculateFutureValue({
      initialCapital,
      monthlyContribution,
      annualRate,
      months: 0,
    });

    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      finalAmount: initialCapital,
      totalInvested: initialCapital,
      totalInterest: 0,
      monthlyData: [],
    };
  }

  // Если нет пополнений и процентной ставки, цель недостижима
  if (monthlyContribution === 0 && annualRate === 0) {
    return null;
  }

  const monthlyRate = annualRate / 100 / 12;
  let balance = initialCapital;
  let totalInvested = initialCapital;
  let months = 0;
  const maxMonths = 1200; // Максимум 100 лет
  const monthlyData: MonthlyDataPoint[] = [];

  while (balance < targetAmount && months < maxMonths) {
    months++;
    const interestForMonth = balance * monthlyRate;
    balance = balance + interestForMonth + monthlyContribution;
    totalInvested += monthlyContribution;

    monthlyData.push({
      month: months,
      balance: Math.round(balance * 100) / 100,
      invested: Math.round(totalInvested * 100) / 100,
      interest: Math.round((balance - totalInvested) * 100) / 100,
    });
  }

  if (months >= maxMonths) {
    return null; // Цель недостижима в разумные сроки
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return {
    months,
    years,
    remainingMonths,
    finalAmount: Math.round(balance * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalInterest: Math.round((balance - totalInvested) * 100) / 100,
    monthlyData,
  };
}

/**
 * Параметры для расчета ежемесячных отчислений
 */
export interface MonthlyPaymentParams {
  initialCapital: number;
  annualRate: number;
  targetAmount: number;
  months: number;
}

/**
 * Результат расчета ежемесячных отчислений
 */
export interface MonthlyPaymentResult {
  monthlyPayment: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: MonthlyDataPoint[];
}

/**
 * Расчет необходимой суммы ежемесячных отчислений
 * PMT = (FV - PV × (1 + r)^n) / [((1 + r)^n - 1) / r]
 */
export function calculateMonthlyPayment({
  initialCapital,
  annualRate,
  targetAmount,
  months,
}: MonthlyPaymentParams): MonthlyPaymentResult | null {
  const monthlyRate = annualRate / 100 / 12;

  // Расчет будущей стоимости начального капитала
  const futureValueOfInitial =
    initialCapital * Math.pow(1 + monthlyRate, months);

  // Если начальный капитал уже достигнет цели
  if (futureValueOfInitial >= targetAmount) {
    const result = calculateFutureValue({
      initialCapital,
      monthlyContribution: 0,
      annualRate,
      months,
    });

    return {
      monthlyPayment: 0,
      totalInvested: initialCapital,
      totalInterest: result.totalInterest,
      monthlyData: result.monthlyData,
    };
  }

  // Расчет необходимого ежемесячного платежа
  let monthlyPayment: number;

  if (monthlyRate === 0) {
    // Если процентная ставка = 0, используем простое деление
    monthlyPayment = (targetAmount - initialCapital) / months;
  } else {
    const futureValueFactor =
      (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    monthlyPayment = (targetAmount - futureValueOfInitial) / futureValueFactor;
  }

  // Проверка на отрицательное значение
  if (monthlyPayment < 0) {
    return null;
  }

  // Генерация данных по месяцам
  const result = calculateFutureValue({
    initialCapital,
    monthlyContribution: monthlyPayment,
    annualRate,
    months,
  });

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInvested: result.totalInvested,
    totalInterest: result.totalInterest,
    monthlyData: result.monthlyData,
  };
}

/**
 * Параметры валидации входных данных
 */
export interface ValidationParams {
  initialCapital?: number;
  monthlyContribution?: number;
  annualRate?: number;
  targetAmount?: number;
  months?: number;
}

/**
 * Результат валидации
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Валидация входных данных для расчетов
 */
export function validateInputs(params: ValidationParams): ValidationResult {
  const errors: Record<string, string> = {};

  // Валидация начального капитала
  if (params.initialCapital !== undefined) {
    if (params.initialCapital < 0) {
      errors.initialCapital = "Начальный капитал не может быть отрицательным";
    }
    if (params.initialCapital > 1000000000) {
      errors.initialCapital = "Начальный капитал слишком большой";
    }
  }

  // Валидация ежемесячных отчислений
  if (params.monthlyContribution !== undefined) {
    if (params.monthlyContribution < 0) {
      errors.monthlyContribution =
        "Ежемесячные отчисления не могут быть отрицательными";
    }
    if (params.monthlyContribution > 10000000) {
      errors.monthlyContribution = "Ежемесячные отчисления слишком большие";
    }
  }

  // Валидация процентной ставки
  if (params.annualRate !== undefined) {
    if (params.annualRate < 0) {
      errors.annualRate = "Процентная ставка не может быть отрицательной";
    }
    if (params.annualRate > 100) {
      errors.annualRate = "Процентная ставка не может быть больше 100%";
    }
  }

  // Валидация целевой суммы
  if (params.targetAmount !== undefined) {
    if (params.targetAmount <= 0) {
      errors.targetAmount = "Целевая сумма должна быть больше 0";
    }
    if (params.targetAmount > 1000000000) {
      errors.targetAmount = "Целевая сумма слишком большая";
    }
  }

  // Валидация периода
  if (params.months !== undefined) {
    if (params.months <= 0) {
      errors.months = "Период должен быть больше 0";
    }
    if (params.months > 1200) {
      errors.months = "Период не может быть больше 100 лет (1200 месяцев)";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
