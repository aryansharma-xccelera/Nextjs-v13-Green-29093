import { apiFetch } from "@/lib/api-client";
import { mockTransactions } from "@/lib/mock-data";
import {
  DashboardSummary,
  MonthlySummary,
  Transaction,
  TransactionInput,
} from "@/types";
import { groupTransactionsByCategory, monthKeyFromDate } from "@/lib/utils";
import { RECENT_TRANSACTIONS_LIMIT } from "@/lib/constants";

const STORAGE_KEY = "transactions";

// MOCK: stands in for GET /transactions — seeds localStorage once from mockTransactions.
function load(): Transaction[] {
  if (typeof window === "undefined") {
    return mockTransactions;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Transaction[];
    } catch {
      return mockTransactions;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTransactions));
  return mockTransactions;
}

function persist(transactions: Transaction[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}

// MOCK: stands in for GET /transactions
function localGetAll(): Transaction[] {
  return load().slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

// MOCK: stands in for GET /transactions/:id
function localGetById(id: string): Transaction | undefined {
  return load().find((transaction) => transaction.id === id);
}

// MOCK: stands in for POST /transactions
function localCreate(input: TransactionInput): Transaction {
  const all = load();
  const now = new Date().toISOString();
  const transaction: Transaction = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const next = [transaction, ...all];
  persist(next);
  return transaction;
}

// MOCK: stands in for PUT /transactions/:id
function localUpdate(id: string, input: TransactionInput): Transaction | undefined {
  const all = load();
  const index = all.findIndex((transaction) => transaction.id === id);
  if (index === -1) {
    return undefined;
  }
  const updated: Transaction = {
    ...all[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  const next = all.slice();
  next[index] = updated;
  persist(next);
  return updated;
}

// MOCK: stands in for DELETE /transactions/:id
function localDelete(id: string): boolean {
  const all = load();
  const next = all.filter((transaction) => transaction.id !== id);
  persist(next);
  return next.length !== all.length;
}

// MOCK: stands in for GET /transactions/summary/dashboard
function localGetDashboardSummary(): DashboardSummary {
  const all = load();
  const totalIncome = all
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = all
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = all
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, RECENT_TRANSACTIONS_LIMIT);
  const categoryBreakdown = groupTransactionsByCategory(
    all.filter((t) => t.type === "Expense")
  );
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: all.length,
    categoryBreakdown,
    recentTransactions,
  };
}

// MOCK: stands in for GET /transactions/summary/monthly?month=YYYY-MM
function localGetMonthlySummary(monthKey: string): MonthlySummary {
  const all = load().filter((t) => monthKeyFromDate(t.date) === monthKey);
  const totalIncome = all
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = all
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const categoryBreakdown = groupTransactionsByCategory(
    all.filter((t) => t.type === "Expense")
  );
  return {
    month: monthKey,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    categoryBreakdown,
  };
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function getAll(): Promise<Transaction[]> {
  if (USE_MOCK) {
    return localGetAll();
  }
  return apiFetch<Transaction[]>("/api/v1/transactions");
}

export async function getById(id: string): Promise<Transaction | undefined> {
  if (USE_MOCK) {
    return localGetById(id);
  }
  return apiFetch<Transaction>(`/api/v1/transactions/${id}`);
}

export async function create(input: TransactionInput): Promise<Transaction> {
  if (USE_MOCK) {
    return localCreate(input);
  }
  return apiFetch<Transaction>("/api/v1/transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function update(
  id: string,
  input: TransactionInput
): Promise<Transaction | undefined> {
  if (USE_MOCK) {
    return localUpdate(id, input);
  }
  return apiFetch<Transaction>(`/api/v1/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function remove(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return localDelete(id);
  }
  await apiFetch(`/api/v1/transactions/${id}`, { method: "DELETE" });
  return true;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK) {
    return localGetDashboardSummary();
  }
  return apiFetch<DashboardSummary>("/api/v1/transactions/summary/dashboard");
}

export async function getMonthlySummary(monthKey: string): Promise<MonthlySummary> {
  if (USE_MOCK) {
    return localGetMonthlySummary(monthKey);
  }
  return apiFetch<MonthlySummary>(
    `/api/v1/transactions/summary/monthly?month=${monthKey}`
  );
}
