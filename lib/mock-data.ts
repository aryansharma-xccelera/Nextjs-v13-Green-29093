// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.

import { Category, Transaction, User } from "@/types";

// MOCK: seed account for the login/sign-up demo flow. Password is plaintext
// for local-only mock persistence — never do this against a real backend.
export const mockUsers: Array<User & { password: string }> = [
  {
    id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    createdAt: new Date(2024, 0, 1).toISOString(),
  },
];

export const PREDEFINED_CATEGORY_NAMES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

export const mockCategories: Category[] = PREDEFINED_CATEGORY_NAMES.map(
  (name, index) => ({
    id: `cat-predefined-${index + 1}`,
    name,
    isCustom: false,
    isActive: true,
    createdAt: new Date(2024, 0, 1).toISOString(),
  })
);

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    amount: 3200,
    type: "Income",
    category: "Other",
    date: daysAgo(28),
    description: "Monthly salary",
    createdAt: daysAgo(28),
    updatedAt: daysAgo(28),
  },
  {
    id: "txn-2",
    amount: 45.5,
    type: "Expense",
    category: "Food",
    date: daysAgo(27),
    description: "Groceries at supermarket",
    createdAt: daysAgo(27),
    updatedAt: daysAgo(27),
  },
  {
    id: "txn-3",
    amount: 120,
    type: "Expense",
    category: "Bills",
    date: daysAgo(25),
    description: "Electricity bill",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  {
    id: "txn-4",
    amount: 60,
    type: "Expense",
    category: "Entertainment",
    date: daysAgo(24),
    description: "Movie night",
    createdAt: daysAgo(24),
    updatedAt: daysAgo(24),
  },
  {
    id: "txn-5",
    amount: 250,
    type: "Expense",
    category: "Shopping",
    date: daysAgo(20),
    description: "New shoes",
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: "txn-6",
    amount: 500,
    type: "Income",
    category: "Other",
    date: daysAgo(18),
    description: "Freelance project payment",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(18),
  },
  {
    id: "txn-7",
    amount: 80,
    type: "Expense",
    category: "Travel",
    date: daysAgo(16),
    description: "Train tickets",
    createdAt: daysAgo(16),
    updatedAt: daysAgo(16),
  },
  {
    id: "txn-8",
    amount: 35,
    type: "Expense",
    category: "Health",
    date: daysAgo(14),
    description: "Pharmacy",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    id: "txn-9",
    amount: 90,
    type: "Expense",
    category: "Food",
    date: daysAgo(12),
    description: "Dinner with friends",
    createdAt: daysAgo(12),
    updatedAt: daysAgo(12),
  },
  {
    id: "txn-10",
    amount: 200,
    type: "Income",
    category: "Other",
    date: daysAgo(10),
    description: "Gift received",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: "txn-11",
    amount: 150,
    type: "Expense",
    category: "Bills",
    date: daysAgo(8),
    description: "Internet subscription",
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },
  {
    id: "txn-12",
    amount: 75,
    type: "Expense",
    category: "Shopping",
    date: daysAgo(6),
    description: "Books",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    id: "txn-13",
    amount: 40,
    type: "Expense",
    category: "Entertainment",
    date: daysAgo(4),
    description: "Streaming subscription",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: "txn-14",
    amount: 1200,
    type: "Income",
    category: "Other",
    date: daysAgo(2),
    description: "Side project income",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "txn-15",
    amount: 55,
    type: "Expense",
    category: "Food",
    date: daysAgo(1),
    description: "Coffee and lunch",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];
