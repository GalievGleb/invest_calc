/**
 * Типы для калькулятора
 */

export type CalculatorMode = "time" | "payment";

export interface CalculatorState {
  mode: CalculatorMode;
  currentAge: string;
  targetAge: string;
  initialCapital: string;
  monthlyContribution: string;
  annualRate: string;
  desiredMonthlyIncome: string;
  targetAmount: string;
  period: string;
  considerInflation: boolean;
  inflationRate: string;
}

