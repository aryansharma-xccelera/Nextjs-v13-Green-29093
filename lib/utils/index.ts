import { Transaction } from "@/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export function monthKeyFromDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function groupTransactionsByCategory(
  transactions: Transaction[]
): { category: string; total: number }[] {
  const totals = new Map<string, number>();
  transactions.forEach((transaction) => {
    const current = totals.get(transaction.category) ?? 0;
    totals.set(transaction.category, current + transaction.amount);
  });
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export const CATEGORY_COLORS = [
  "#2563eb",
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
  "#e67e22",
];

export function colorForCategoryIndex(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
