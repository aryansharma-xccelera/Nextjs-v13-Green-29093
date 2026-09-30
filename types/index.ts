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

export type SortField = "date" | "amount" | "category";
export type SortDirection = "asc" | "desc";

export interface TransactionFilters {
  search: string;
  type: TransactionType | "All";
  category: string | "All";
  startDate: string;
  endDate: string;
}
