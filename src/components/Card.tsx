interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
