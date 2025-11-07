import { formatCurrency, formatPeriod } from "@/utils/formatters";
import Card from "./Card";

interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultDisplayProps {
  results: ResultItem[];
}

export default function ResultDisplay({ results }: ResultDisplayProps) {
  if (results.length === 0) return null;

  return (
    <Card title="Результаты расчета">
      <div className="space-y-4">
        {results.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center pb-3 ${
              index !== results.length - 1
                ? "border-b border-[var(--card-border)]"
                : ""
            }`}
          >
            <span className="text-muted">{item.label}</span>
            <span
              className={`font-semibold text-lg ${
                item.highlight
                  ? "text-[var(--primary)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { formatCurrency, formatPeriod };
