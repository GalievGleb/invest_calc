interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = fullWidth ? "w-full" : "";
  const variantClasses =
    variant === "primary"
      ? "btn-primary"
      : "bg-[var(--card-bg)] hover:bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--card-border)]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
