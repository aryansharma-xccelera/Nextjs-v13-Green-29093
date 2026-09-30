export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;

export interface Category {
  id: string;
  name: string;
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
}

export type CategoryInput = Omit<Category, "id" | "createdAt">;

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdownItem[];
  recentTransactions: Transaction[];
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
}

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: CategoryBreakdownItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type SortField = "date" | "amount" | "category";
export type SortDirection = "asc" | "desc";

export interface Budget {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetInput = Omit<Budget, "id" | "createdAt" | "updatedAt">;

export type BudgetStatus = "no-budget" | "ok" | "warning" | "exceeded";

export interface CategoryBudgetStatus {
  category: string;
  budgetId: string | null;
  budget: number;
  spent: number;
  remaining: number;
  utilization: number;
  status: BudgetStatus;
}

export interface BudgetSummary {
  month: string;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  categories: CategoryBudgetStatus[];
}

export interface TransactionFilters {
  search: string;
  type: TransactionType | "All";
  category: string | "All";
  startDate: string;
  endDate: string;
}
