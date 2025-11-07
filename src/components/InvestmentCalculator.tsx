"use client";

import { useState } from "react";
import { CalculatorMode, CalculatorState } from "@/types/calculator";
import {
  calculateTimeToGoal,
  calculateMonthlyPayment,
  validateInputs,
  MonthlyDataPoint,
} from "@/utils/calculations";
import { formatCurrency, formatPeriod } from "@/utils/formatters";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import ModeToggle from "./ModeToggle";
import ResultDisplay from "./ResultDisplay";
import InvestmentChart from "./InvestmentChart";
import Checkbox from "./Checkbox";

export default function InvestmentCalculator() {
  const [state, setState] = useState<CalculatorState>({
    mode: "payment",
    currentAge: "25",
    targetAge: "45",
    initialCapital: "100000",
    monthlyContribution: "10000",
    annualRate: "10",
    desiredMonthlyIncome: "100000",
    targetAmount: "12000000",
    period: "240",
    considerInflation: false,
    inflationRate: "8",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<
    Array<{ label: string; value: string; highlight?: boolean }>
  >([]);
  const [chartData, setChartData] = useState<MonthlyDataPoint[]>([]);

  const handleModeChange = (mode: CalculatorMode) => {
    setState({ ...state, mode });
    setResults([]);
    setErrors({});
    setChartData([]);
  };

  const handleInputChange = (field: keyof CalculatorState, value: string) => {
    setState({ ...state, [field]: value });
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleCalculate = () => {
    const initialCapital = parseFloat(state.initialCapital.replace(/\s/g, "")) || 0;
    const monthlyContribution = parseFloat(state.monthlyContribution.replace(/\s/g, "")) || 0;
    const annualRate = parseFloat(state.annualRate.replace(/\s/g, "")) || 0;
    const desiredIncome = parseFloat(state.desiredMonthlyIncome.replace(/\s/g, "")) || 0;
    const inflationRate = parseFloat(state.inflationRate.replace(/\s/g, "")) || 0;
    const period = parseInt(state.period.replace(/\s/g, "")) || 0;
    const currentAge = parseInt(state.currentAge.replace(/\s/g, "")) || 0;
    const targetAge = parseInt(state.targetAge.replace(/\s/g, "")) || 0;

    // Расчет периода из возраста
    const calculatedPeriod = state.mode === "payment" ? (targetAge - currentAge) * 12 : period;
    const years = calculatedPeriod / 12;

    // Корректировка желаемого дохода с учетом инфляции
    // Через N лет нужно будет больше денег для той же покупательной способности
    let adjustedIncome = desiredIncome;
    if (state.considerInflation && inflationRate > 0 && years > 0) {
      // Формула: будущая стоимость = текущая × (1 + инфляция)^годы
      adjustedIncome = desiredIncome * Math.pow(1 + inflationRate / 100, years);
    }

    // Расчет целевой суммы на основе желаемого дохода (с учетом инфляции)
    // Формула: годовой доход / процентная ставка
    const targetAmount = state.mode === "payment" && adjustedIncome > 0 && annualRate > 0
      ? (adjustedIncome * 12) / (annualRate / 100)
      : parseFloat(state.targetAmount.replace(/\s/g, "")) || 0;

    // Валидация входных данных
    const validation = validateInputs({
      initialCapital,
      monthlyContribution: state.mode === "time" ? monthlyContribution : undefined,
      annualRate,
      targetAmount,
      months: state.mode === "payment" ? calculatedPeriod : undefined,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResults([]);
      return;
    }

    setErrors({});

    if (state.mode === "time") {
      // Расчет времени до достижения цели
      const result = calculateTimeToGoal({
        initialCapital,
        monthlyContribution,
        annualRate,
        targetAmount,
      });

      if (!result) {
        setErrors({
          general: "Не удалось достичь целевой суммы с указанными параметрами",
        });
        setResults([]);
        setChartData([]);
        return;
      }

      setResults([
        {
          label: "Время до цели",
          value: formatPeriod(result.years, result.remainingMonths),
          highlight: true,
        },
        {
          label: "Итоговая сумма",
          value: formatCurrency(result.finalAmount),
        },
        {
          label: "Всего инвестировано",
          value: formatCurrency(result.totalInvested),
        },
        {
          label: "Прибыль от процентов",
          value: formatCurrency(result.totalInterest),
        },
      ]);
      setChartData(result.monthlyData);
    } else {
      // Расчет ежемесячных отчислений
      const result = calculateMonthlyPayment({
        initialCapital,
        annualRate,
        targetAmount,
        months: calculatedPeriod,
      });

      if (!result) {
        setErrors({
          general: "Не удалось рассчитать ежемесячные отчисления",
        });
        setResults([]);
        setChartData([]);
        return;
      }

      const resultItems = [
        {
          label: "Требуемый доход в месяц",
          value: formatCurrency(adjustedIncome),
          highlight: true,
        },
        {
          label: "Необходимая сумма капитала",
          value: formatCurrency(targetAmount),
          highlight: true,
        },
        {
          label: "Ежемесячные отчисления",
          value: formatCurrency(result.monthlyPayment),
          highlight: true,
        },
        {
          label: "Всего инвестировано",
          value: formatCurrency(result.totalInvested),
        },
        {
          label: "Прибыль от процентов",
          value: formatCurrency(result.totalInterest),
        },
        {
          label: "Период накопления",
          value: formatPeriod(Math.floor(calculatedPeriod / 12), calculatedPeriod % 12),
        },
        {
          label: "Достигнете цели в возрасте",
          value: `${targetAge} лет`,
        },
      ];

      setResults(resultItems);
      setChartData(result.monthlyData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Калькулятор финансовой независимости
        </h1>
        <p className="text-muted">
          Рассчитайте сколько нужно откладывать для жизни на дивиденды
        </p>
      </div>

      <ModeToggle mode={state.mode} onChange={handleModeChange} />

      <Card title="Параметры расчета">
        {state.mode === "payment" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Текущий возраст"
                value={state.currentAge}
                onChange={(v) => handleInputChange("currentAge", v)}
                suffix="лет"
                min={18}
                max={100}
                step={1}
              />
              <Input
                label="Целевой возраст"
                value={state.targetAge}
                onChange={(v) => handleInputChange("targetAge", v)}
                suffix="лет"
                min={18}
                max={100}
                step={1}
              />
            </div>
            <div>
              <Input
                label="Желаемый пассивный доход в месяц (в сегодняшних ценах)"
                value={state.desiredMonthlyIncome}
                onChange={(v) => handleInputChange("desiredMonthlyIncome", v)}
                suffix="₽"
                formatNumber
                min={0}
                step={10000}
              />
              {state.considerInflation && state.desiredMonthlyIncome && (
                <div className="mt-2 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
                  <p className="text-sm text-muted mb-1">
                    С учетом инфляции {state.inflationRate}% через{" "}
                    {parseInt(state.targetAge) - parseInt(state.currentAge)} лет:
                  </p>
                  <p className="text-lg font-semibold text-[var(--primary)]">
                    {formatCurrency(
                      parseFloat(state.desiredMonthlyIncome.replace(/\s/g, "")) *
                        Math.pow(
                          1 + parseFloat(state.inflationRate) / 100,
                          (parseInt(state.targetAge) - parseInt(state.currentAge))
                        )
                    )}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Именно столько вам понадобится через{" "}
                    {parseInt(state.targetAge) - parseInt(state.currentAge)} лет для
                    сохранения той же покупательной способности
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <Input
          label="Начальный капитал"
          value={state.initialCapital}
          onChange={(v) => handleInputChange("initialCapital", v)}
          suffix="₽"
          error={errors.initialCapital}
          formatNumber
          min={0}
          step={1000}
        />

        {state.mode === "time" && (
          <Input
            label="Ежемесячные отчисления"
            value={state.monthlyContribution}
            onChange={(v) => handleInputChange("monthlyContribution", v)}
            suffix="₽"
            error={errors.monthlyContribution}
            formatNumber
            min={0}
            step={1000}
          />
        )}

        <Input
          label="Процентная ставка (годовая)"
          value={state.annualRate}
          onChange={(v) => handleInputChange("annualRate", v)}
          suffix="%"
          error={errors.annualRate}
          min={0}
          max={100}
          step={0.1}
        />

        <Checkbox
          label="Учитывать инфляцию"
          checked={state.considerInflation}
          onChange={(checked) =>
            setState({ ...state, considerInflation: checked })
          }
          description="Реальная покупательная способность денег со временем уменьшается"
        />

        {state.considerInflation && (
          <Input
            label="Ожидаемая инфляция (годовая)"
            value={state.inflationRate}
            onChange={(v) => handleInputChange("inflationRate", v)}
            suffix="%"
            min={0}
            max={50}
            step={0.1}
          />
        )}

        {state.mode === "time" && (
          <Input
            label="Целевая сумма капитала"
            value={state.targetAmount}
            onChange={(v) => handleInputChange("targetAmount", v)}
            suffix="₽"
            error={errors.targetAmount}
            formatNumber
            min={0}
            step={10000}
          />
        )}

        {state.mode === "time" && (
          <Input
            label="Период (месяцев)"
            value={state.period}
            onChange={(v) => handleInputChange("period", v)}
            suffix="мес."
            error={errors.months}
            min={1}
            max={1200}
            step={1}
          />
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg">
            <p className="text-[var(--error)]">{errors.general}</p>
          </div>
        )}

        <Button onClick={handleCalculate} fullWidth>
          Рассчитать
        </Button>
      </Card>

      <ResultDisplay results={results} />

      <InvestmentChart data={chartData} />
    </div>
  );
}

