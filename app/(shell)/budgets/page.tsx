"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  BudgetProgressBar,
  budgetStatusLabel,
  budgetStatusTextClass,
} from "@/components/BudgetProgressBar";
import { getAll as getAllCategories } from "@/lib/stores/category-store";
import {
  getAll as getAllBudgets,
  getBudgetSummary,
  remove as removeBudget,
  upsert as upsertBudget,
} from "@/lib/stores/budget-store";
import { Budget, Category, CategoryBudgetStatus } from "@/types";
import { formatCurrency, currentMonthKey, monthOptions } from "@/lib/utils";
import { validateAmount } from "@/lib/validation";

export default function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [statuses, setStatuses] = useState<CategoryBudgetStatus[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [isLoading, setIsLoading] = useState(true);
  const [draftAmounts, setDraftAmounts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Budget | null>(null);
  const options = monthOptions();

  async function loadData() {
    setIsLoading(true);
    const [categoryList, budgetList, summary] = await Promise.all([
      getAllCategories(),
      getAllBudgets(),
      getBudgetSummary(selectedMonth),
    ]);
    setCategories(categoryList);
    setBudgets(budgetList);
    setStatuses(summary.categories);
    setDraftAmounts((previous) => {
      const next = { ...previous };
      categoryList.forEach((category) => {
        if (next[category.name] === undefined) {
          const existing = budgetList.find((b) => b.category === category.name);
          next[category.name] = existing ? String(existing.amount) : "";
        }
      });
      return next;
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  function statusFor(categoryName: string): CategoryBudgetStatus | undefined {
    return statuses.find((s) => s.category === categoryName);
  }

  async function handleSave(categoryName: string) {
    const value = draftAmounts[categoryName] ?? "";
    const errorMessage = validateAmount(value);
    if (errorMessage) {
      setErrors((previous) => ({ ...previous, [categoryName]: errorMessage }));
      return;
    }
    setErrors((previous) => ({ ...previous, [categoryName]: "" }));
    setSavingCategory(categoryName);
    await upsertBudget({ category: categoryName, amount: Number(value) });
    setSavingCategory(null);
    toast.success(`Budget for ${categoryName} saved successfully.`);
    loadData();
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) {
      return;
    }
    await removeBudget(pendingDelete.id);
    setDraftAmounts((previous) => ({
      ...previous,
      [pendingDelete.category]: "",
    }));
    setPendingDelete(null);
    toast.success("Budget removed successfully.");
    loadData();
  }

  if (isLoading && categories.length === 0) {
    return <LoadingSpinner label="Loading budgets..." />;
  }

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
        <p className="mt-2 text-xs text-text-secondary">
          Budgets apply every month. Spending shown reflects the selected month.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading budgets..." />
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet — add a category first." />
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const status = statusFor(category.name);
            const existingBudget = budgets.find((b) => b.category === category.name);
            const draft = draftAmounts[category.name] ?? "";
            const error = errors[category.name];

            return (
              <div
                key={category.id}
                className="rounded-card border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {category.name}
                    </h3>
                    {status && status.budget > 0 && (
                      <p
                        className={`text-xs font-medium ${budgetStatusTextClass(
                          status.status
                        )}`}
                      >
                        {budgetStatusLabel(status.status)} &middot; {status.utilization}
                        % used
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft}
                        onChange={(event) =>
                          setDraftAmounts((previous) => ({
                            ...previous,
                            [category.name]: event.target.value,
                          }))
                        }
                        placeholder="No budget"
                        className="w-36 rounded-input border border-border py-2 pl-6 pr-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSave(category.name)}
                      disabled={savingCategory === category.name}
                      className="rounded-input bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingCategory === category.name ? "Saving..." : "Save"}
                    </button>
                    {existingBudget && (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(existingBudget)}
                        className="rounded-input border border-danger px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/10"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {error && <p className="mt-2 text-xs text-danger">{error}</p>}

                {status && status.budget > 0 && (
                  <div className="mt-4 space-y-2">
                    <BudgetProgressBar
                      utilization={status.utilization}
                      status={status.status}
                    />
                    <div className="flex flex-wrap justify-between text-xs text-text-secondary">
                      <span>Spent: {formatCurrency(status.spent)}</span>
                      <span>Budget: {formatCurrency(status.budget)}</span>
                      <span
                        className={
                          status.remaining < 0 ? "text-danger" : "text-text-secondary"
                        }
                      >
                        {status.remaining < 0 ? "Over by " : "Remaining: "}
                        {formatCurrency(Math.abs(status.remaining))}
                      </span>
                    </div>
                    {status.status === "warning" && (
                      <p className="rounded-input bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
                        Warning: you have used {status.utilization}% of this
                        category&apos;s budget.
                      </p>
                    )}
                    {status.status === "exceeded" && (
                      <p className="rounded-input bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
                        Budget exceeded for this category this month.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Remove budget"
        message={
          pendingDelete
            ? `Are you sure you want to remove the budget for "${pendingDelete.category}"?`
            : "Are you sure you want to remove this budget?"
        }
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
