"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { getAll, remove } from "@/lib/stores/transaction-store";
import { getAll as getAllCategories } from "@/lib/stores/category-store";
import {
  Category,
  SortDirection,
  SortField,
  Transaction,
  TransactionFilters,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SORT_FIELDS } from "@/lib/constants";
import toast from "react-hot-toast";

const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "All",
  category: "All",
  startDate: "",
  endDate: "",
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [transactionData, categoryData] = await Promise.all([
      getAll(),
      getAllCategories(),
    ]);
    setTransactions(transactionData);
    setCategories(categoryData);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = transactions.slice();

    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(term) ||
          transaction.category.toLowerCase().includes(term)
      );
    }

    if (filters.type !== "All") {
      result = result.filter((transaction) => transaction.type === filters.type);
    }

    if (filters.category !== "All") {
      result = result.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (transaction) => transaction.date >= new Date(filters.startDate).toISOString()
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(
        (transaction) => transaction.date <= end.toISOString()
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.date.localeCompare(b.date);
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else {
        comparison = a.category.localeCompare(b.category);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters, sortField, sortDirection]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "All" ||
    filters.category !== "All" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) {
      return;
    }
    await remove(pendingDeleteId);
    setPendingDeleteId(null);
    toast.success("Transaction deleted successfully.");
    loadData();
  }

  const transactionPendingDelete = transactions.find(
    (transaction) => transaction.id === pendingDeleteId
  );

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }
            placeholder="Search description or category"
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none lg:col-span-2"
          />

          <select
            value={filters.type}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                type: event.target.value as TransactionFilters["type"],
              }))
            }
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, category: event.target.value }))
            }
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(event) => {
              const [field, direction] = event.target.value.split("-") as [
                SortField,
                SortDirection
              ];
              setSortField(field);
              setSortDirection(direction);
            }}
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {SORT_FIELDS.map((field) => (
              <optgroup key={field.value} label={field.label}>
                <option value={`${field.value}-asc`}>{field.label} (Ascending)</option>
                <option value={`${field.value}-desc`}>{field.label} (Descending)</option>
              </optgroup>
            ))}
          </select>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, startDate: event.target.value }))
            }
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, endDate: event.target.value }))
            }
            className="rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-input border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-surface"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading transactions..." />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          message={
            hasActiveFilters
              ? "No transactions match your filters."
              : "No transactions yet — add one to get started."
          }
          actionLabel="Add Transaction"
          onAction={() => router.push("/transactions/add")}
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="border-b border-border bg-surface text-xs uppercase text-text-secondary">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-surface">
                  <td className="px-4 py-3 text-text-secondary">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-text-primary">
                    {transaction.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {transaction.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        transaction.type === "Income"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      transaction.type === "Income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {transaction.type === "Income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/transactions/${transaction.id}/edit`)
                        }
                        className="rounded-input border border-border px-3 py-1 text-xs font-semibold text-text-secondary hover:bg-surface"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(transaction.id)}
                        className="rounded-input border border-danger px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-border md:hidden">
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">
                    {transaction.description || transaction.category}
                  </p>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === "Income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {transaction.type === "Income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {transaction.category} &middot; {formatDate(transaction.date)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                    className="flex-1 rounded-input border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(transaction.id)}
                    className="flex-1 rounded-input border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="Delete transaction"
        message={
          transactionPendingDelete
            ? `Are you sure you want to delete "${
                transactionPendingDelete.description || transactionPendingDelete.category
              }" (${formatCurrency(transactionPendingDelete.amount)})? This action cannot be undone.`
            : "Are you sure you want to delete this transaction?"
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
