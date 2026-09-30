import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount?: number;
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
  transactionCount,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      valueClass: "text-success",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      valueClass: "text-danger",
    },
    {
      label: "Current Balance",
      value: formatCurrency(balance),
      valueClass: balance >= 0 ? "text-success" : "text-danger",
    },
  ];

  if (transactionCount !== undefined) {
    cards.push({
      label: "Transactions",
      value: String(transactionCount),
      valueClass: "text-text-primary",
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-card border border-border bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-text-secondary">{card.label}</p>
          <p className={`mt-2 text-2xl font-bold ${card.valueClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
