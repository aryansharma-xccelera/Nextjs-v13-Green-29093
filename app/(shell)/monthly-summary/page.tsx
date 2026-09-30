"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import {
  BudgetProgressBar,
  budgetStatusLabel,
  budgetStatusTextClass,
} from "@/components/BudgetProgressBar";
import { getMonthlySummary } from "@/lib/stores/transaction-store";
import { getBudgetSummary } from "@/lib/stores/budget-store";
import { BudgetSummary, MonthlySummary } from "@/types";
import { currentMonthKey, formatCurrency, monthOptions } from "@/lib/utils";

export default function MonthlySummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const options = monthOptions();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.all([
      getMonthlySummary(selectedMonth),
      getBudgetSummary(selectedMonth),
    ]).then(([summaryData, budgetData]) => {
      if (isMounted) {
        setSummary(summaryData);
        setBudgetSummary(budgetData);
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

      {isLoading || !summary || !budgetSummary ? (
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

          <div className="rounded-card border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Budget Summary
              </h2>
              <Link
                href="/budgets"
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage Budgets
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-input border border-border p-4">
                <p className="text-xs font-medium text-text-secondary">
                  Total Budget
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">
                  {formatCurrency(budgetSummary.totalBudget)}
                </p>
              </div>
              <div className="rounded-input border border-border p-4">
                <p className="text-xs font-medium text-text-secondary">
                  Total Spent
                </p>
                <p className="mt-1 text-xl font-bold text-danger">
                  {formatCurrency(budgetSummary.totalSpent)}
                </p>
              </div>
              <div className="rounded-input border border-border p-4">
                <p className="text-xs font-medium text-text-secondary">
                  Remaining
                </p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    budgetSummary.totalRemaining < 0 ? "text-danger" : "text-success"
                  }`}
                >
                  {formatCurrency(budgetSummary.totalRemaining)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-text-primary">
                Budget vs Actual by Category
              </h3>
              {budgetSummary.categories.length === 0 ? (
                <div className="mt-4">
                  <EmptyState message="No budgets or expenses recorded for this month." />
                </div>
              ) : (
                <ul className="mt-4 space-y-4">
                  {budgetSummary.categories.map((category) => (
                    <li key={category.category}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-text-primary">
                          {category.category}
                        </span>
                        <span className={budgetStatusTextClass(category.status)}>
                          {category.budget > 0
                            ? `${formatCurrency(category.spent)} / ${formatCurrency(
                                category.budget
                              )} (${category.utilization}%)`
                            : `${formatCurrency(category.spent)} spent \u2014 ${budgetStatusLabel(
                                category.status
                              )}`}
                        </span>
                      </div>
                      <div className="mt-1">
                        <BudgetProgressBar
                          utilization={category.utilization}
                          status={category.status}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
