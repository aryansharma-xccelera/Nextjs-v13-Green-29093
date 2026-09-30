"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getDashboardSummary } from "@/lib/stores/transaction-store";
import { DashboardSummary } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getDashboardSummary().then((data) => {
      if (isMounted) {
        setSummary(data);
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
