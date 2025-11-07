interface InputProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  suffix?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  formatNumber?: boolean;
}

export default function Input({
  label,
  value,
  onChange,
  onBlur,
  type = "number",
  placeholder,
  suffix,
  error,
  min,
  max,
  step,
  formatNumber = false,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (formatNumber) {
      // Удаляем все пробелы для получения чистого числа
      newValue = newValue.replace(/\s/g, "");
    }

    onChange(newValue);
  };

  const handleBlur = () => {
    if (onBlur && value) {
      onBlur(value.toString());
    }
  };

  // Форматирование значения для отображения
  const getDisplayValue = () => {
    // Если значение пустое или undefined
    if (value === "" || value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    // Если нужно форматирование - применяем всегда
    if (formatNumber && stringValue) {
      return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return stringValue;
  };

  const displayValue = getDisplayValue();

  // Если используется форматирование, нужен type="text", иначе браузер не примет пробелы
  const inputType = formatNumber ? "text" : type;

  return (
    <div className="mb-4">
      <label className="label-text">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`input-field ${suffix ? "pr-12" : ""} ${error ? "border-[var(--error)]" : ""}`}
          min={min}
          max={max}
          step={step}
          inputMode={formatNumber ? "numeric" : undefined}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-[var(--error)] text-sm mt-1">{error}</p>}
    </div>
  );
}
