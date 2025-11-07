interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  description,
}: CheckboxProps) {
  return (
    <div className="mb-4">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
        />
        <div className="ml-3">
          <span className="text-[var(--foreground)] font-medium">{label}</span>
          {description && (
            <p className="text-sm text-muted mt-1">{description}</p>
          )}
        </div>
      </label>
    </div>
  );
}

