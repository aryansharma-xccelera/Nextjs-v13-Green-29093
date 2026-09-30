"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getDashboardSummary } from "@/lib/stores/transaction-store";
import { getBudgetSummary } from "@/lib/stores/budget-store";
import { DashboardSummary, CategoryBudgetStatus } from "@/types";
import { formatCurrency, formatDate, currentMonthKey } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<CategoryBudgetStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getDashboardSummary(),
      getBudgetSummary(currentMonthKey()),
    ]).then(([dashboardData, budgetData]) => {
      if (isMounted) {
        setSummary(dashboardData);
        setBudgetAlerts(
          budgetData.categories.filter(
            (category) => category.status === "warning" || category.status === "exceeded"
          )
        );
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !summary) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <SummaryCards
        totalIncome={summary.totalIncome}
        totalExpenses={summary.totalExpenses}
        balance={summary.balance}
        transactionCount={summary.transactionCount}
      />

      {budgetAlerts.length > 0 && (
        <div className="rounded-card border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Budget Alerts
            </h2>
            <Link
              href="/budgets"
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage Budgets
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {budgetAlerts.map((alert) => (
              <li
                key={alert.category}
                className={`flex items-center justify-between rounded-input px-3 py-2 text-sm ${
                  alert.status === "exceeded" ? "bg-danger/10" : "bg-warning/10"
                }`}
              >
                <span
                  className={`font-medium ${
                    alert.status === "exceeded" ? "text-danger" : "text-warning"
                  }`}
                >
                  {alert.status === "exceeded"
                    ? `${alert.category}: budget exceeded`
                    : `${alert.category}: nearing budget limit`}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatCurrency(alert.spent)} of {formatCurrency(alert.budget)} (
                  {alert.utilization}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdown items={summary.categoryBreakdown} />

        <div className="rounded-card border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Transactions
            </h2>
            <Link
              href="/transactions"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All Transactions
            </Link>
          </div>

          {summary.recentTransactions.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                message="No transactions yet — add one to get started."
                actionLabel="Add Transaction"
                onAction={() => router.push("/transactions/add")}
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {summary.recentTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {transaction.description || transaction.category}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {transaction.category} &middot; {formatDate(transaction.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === "Income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {transaction.type === "Income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
