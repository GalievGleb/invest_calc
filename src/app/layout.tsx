import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Инвестиционный калькулятор | Skillspace",
  description:
    "Рассчитайте время или ежемесячные отчисления для достижения финансовой цели. Учет процентной ставки и начального капитала.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
