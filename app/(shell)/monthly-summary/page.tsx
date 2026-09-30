"use client";

import { useEffect, useState } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { getMonthlySummary } from "@/lib/stores/transaction-store";
import { MonthlySummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

function currentMonthKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function monthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label });
  }
  return options;
}

export default function MonthlySummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const options = monthOptions();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getMonthlySummary(selectedMonth).then((data) => {
      if (isMounted) {
        setSummary(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedMonth]);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Select Month
        </label>
        <select
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="w-full max-w-xs rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading || !summary ? (
        <LoadingSpinner label="Loading monthly summary..." />
      ) : (
        <div className="space-y-6">
          <SummaryCards
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
            balance={summary.balance}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryBreakdown
              items={summary.categoryBreakdown}
              title="Expense Breakdown by Category"
            />

            <div className="rounded-card border border-border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary">
                Category Details
              </h2>
              {summary.categoryBreakdown.length === 0 ? (
                <div className="mt-4">
                  <EmptyState message="No expenses recorded for this month." />
                </div>
              ) : (
                <table className="mt-4 w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase text-text-secondary">
                    <tr>
                      <th className="py-2">Category</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {summary.categoryBreakdown.map((item) => (
                      <tr key={item.category}>
                        <td className="py-2 text-text-primary">{item.category}</td>
                        <td className="py-2 text-right font-semibold text-danger">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
