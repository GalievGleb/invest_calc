import { CalculatorMode } from "@/types/calculator";

interface ModeToggleProps {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange("time")}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
          mode === "time"
            ? "bg-[var(--primary)] text-white"
            : "bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--foreground)] border border-[var(--card-border)]"
        }`}
      >
        Рассчитать время
      </button>
      <button
        onClick={() => onChange("payment")}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
          mode === "payment"
            ? "bg-[var(--primary)] text-white"
            : "bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--foreground)] border border-[var(--card-border)]"
        }`}
      >
        Рассчитать отчисления
      </button>
    </div>
  );
}
