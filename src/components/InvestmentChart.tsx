"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyDataPoint } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatters";
import Card from "./Card";

interface InvestmentChartProps {
  data: MonthlyDataPoint[];
}

interface ChartDataPoint {
  month: number;
  balance: number;
  invested: number;
}

export default function InvestmentChart({ data }: InvestmentChartProps) {
  if (!data || data.length === 0) return null;

  // Преобразование данных для графика
  const chartData: ChartDataPoint[] = data.map((item) => ({
    month: item.month,
    balance: item.balance,
    invested: item.invested,
  }));

  // Кастомный тултип
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const month = dataPoint.month;
      const balance = dataPoint.balance;
      const invested = dataPoint.invested;
      const profit = balance - invested;
      
      const years = Math.floor(month / 12);
      const months = month % 12;

      return (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--foreground)] font-medium mb-2">
            {years > 0 && `${years} ${getYearWord(years)} `}
            {months > 0 && `${months} ${getMonthWord(months)}`}
          </p>
          <p className="text-[var(--primary)] text-sm">
            Капитал: {formatCurrency(balance)}
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Вложено: {formatCurrency(invested)}
          </p>
          <p className="text-[var(--success)] text-sm">
            Прибыль: {formatCurrency(profit)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="График роста капитала">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              tickFormatter={(value) => {
                const years = Math.floor(value / 12);
                const months = value % 12;
                if (years === 0) return `${months}м`;
                if (months === 0) return `${years}г`;
                return `${years}г ${months}м`;
              }}
            />
            <YAxis
              stroke="var(--text-muted)"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                }
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                color: "var(--foreground)",
              }}
              formatter={(value) => {
                if (value === "balance") return "Капитал";
                if (value === "invested") return "Вложено";
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="var(--text-muted)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

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

