import { apiFetch } from "@/lib/api-client";
import { getAll as getAllTransactions } from "@/lib/stores/transaction-store";
import { monthKeyFromDate } from "@/lib/utils";
import {
  Budget,
  BudgetInput,
  BudgetSummary,
  BudgetStatus,
  CategoryBudgetStatus,
} from "@/types";

const STORAGE_KEY = "budgets";
const WARNING_THRESHOLD = 0.8;

// MOCK: stands in for GET /budgets — no budgets are configured until the
// user sets one, so there is nothing to seed here (unlike categories/
// transactions which ship with sample data).
function load(): Budget[] {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

function persist(budgets: Budget[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  }
}

// MOCK: stands in for GET /budgets
function localGetAll(): Budget[] {
  return load();
}

// MOCK: stands in for PUT /budgets (create-or-update by category)
function localUpsert(input: BudgetInput): Budget {
  const all = load();
  const now = new Date().toISOString();
  const existingIndex = all.findIndex(
    (budget) => budget.category === input.category
  );
  if (existingIndex !== -1) {
    const updated: Budget = {
      ...all[existingIndex],
      amount: input.amount,
      updatedAt: now,
    };
    const next = all.slice();
    next[existingIndex] = updated;
    persist(next);
    return updated;
  }
  const created: Budget = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const next = [...all, created];
  persist(next);
  return created;
}

// MOCK: stands in for DELETE /budgets/:id
function localRemove(id: string): boolean {
  const all = load();
  const next = all.filter((budget) => budget.id !== id);
  persist(next);
  return next.length !== all.length;
}

function buildSummary(
  monthKey: string,
  budgets: Budget[],
  expensesForMonth: { category: string; amount: number }[]
): BudgetSummary {
  const spentByCategory = new Map<string, number>();
  expensesForMonth.forEach((expense) => {
    spentByCategory.set(
      expense.category,
      (spentByCategory.get(expense.category) ?? 0) + expense.amount
    );
  });

  const categoryNames = new Set<string>([
    ...budgets.map((budget) => budget.category),
    ...Array.from(spentByCategory.keys()),
  ]);

  const categories: CategoryBudgetStatus[] = Array.from(categoryNames)
    .map((category) => {
      const matchingBudget = budgets.find((b) => b.category === category);
      const budgetAmount = matchingBudget?.amount ?? 0;
      const spent = spentByCategory.get(category) ?? 0;
      const remaining = budgetAmount - spent;
      const utilization =
        budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

      let status: BudgetStatus = "no-budget";
      if (budgetAmount > 0) {
        if (spent > budgetAmount) {
          status = "exceeded";
        } else if (spent >= budgetAmount * WARNING_THRESHOLD) {
          status = "warning";
        } else {
          status = "ok";
        }
      }

      return {
        category,
        budgetId: matchingBudget?.id ?? null,
        budget: budgetAmount,
        spent,
        remaining,
        utilization,
        status,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return {
    month: monthKey,
    totalBudget,
    totalSpent,
    totalRemaining: totalBudget - totalSpent,
    categories,
  };
}

// MOCK: stands in for GET /budgets/summary?month=YYYY-MM — derives spend
// totals from existing transactions rather than a dedicated backend report.
async function localGetBudgetSummary(monthKey: string): Promise<BudgetSummary> {
  const [budgets, transactions] = await Promise.all([
    Promise.resolve(load()),
    getAllTransactions(),
  ]);
  const expensesForMonth = transactions
    .filter((t) => t.type === "Expense" && monthKeyFromDate(t.date) === monthKey)
    .map((t) => ({ category: t.category, amount: t.amount }));
  return buildSummary(monthKey, budgets, expensesForMonth);
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function getAll(): Promise<Budget[]> {
  if (USE_MOCK) {
    return localGetAll();
  }
  return apiFetch<Budget[]>("/api/v1/budgets");
}

export async function upsert(input: BudgetInput): Promise<Budget> {
  if (USE_MOCK) {
    return localUpsert(input);
  }
  return apiFetch<Budget>("/api/v1/budgets", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function remove(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return localRemove(id);
  }
  await apiFetch(`/api/v1/budgets/${id}`, { method: "DELETE" });
  return true;
}

export async function getBudgetSummary(monthKey: string): Promise<BudgetSummary> {
  if (USE_MOCK) {
    return localGetBudgetSummary(monthKey);
  }
  return apiFetch<BudgetSummary>(`/api/v1/budgets/summary?month=${monthKey}`);
}
