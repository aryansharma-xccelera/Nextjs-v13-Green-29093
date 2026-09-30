export const ROUTES = {
  dashboard: "/dashboard",
  transactions: "/transactions",
  addTransaction: "/transactions/add",
  editTransaction: (id: string) => `/transactions/${id}/edit`,
  categories: "/categories",
  monthlySummary: "/monthly-summary",
  budgets: "/budgets",
};

export const BUDGET_WARNING_THRESHOLD = 0.8;

export const RECENT_TRANSACTIONS_LIMIT = 5;

export const MIN_DESCRIPTION_LENGTH = 0;
export const MAX_DESCRIPTION_LENGTH = 200;

export const TRANSACTION_TYPES = ["Income", "Expense"] as const;

export const SORT_FIELDS = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
  { value: "category", label: "Category" },
] as const;
