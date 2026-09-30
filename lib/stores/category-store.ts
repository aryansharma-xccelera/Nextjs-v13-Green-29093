import { apiFetch } from "@/lib/api-client";
import { mockCategories } from "@/lib/mock-data";
import { Category, CategoryInput } from "@/types";
import { getAll as getAllTransactions } from "@/lib/stores/transaction-store";

const STORAGE_KEY = "categories";

// MOCK: stands in for GET /categories — seeds localStorage once from mockCategories.
function load(): Category[] {
  if (typeof window === "undefined") {
    return mockCategories;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Category[];
    } catch {
      return mockCategories;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  return mockCategories;
}

function persist(categories: Category[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
}

// MOCK: stands in for GET /categories
function localGetAll(): Category[] {
  return load().filter((category) => category.isActive);
}

// MOCK: stands in for POST /categories
function localCreate(input: CategoryInput): Category {
  const all = load();
  const category: Category = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const next = [...all, category];
  persist(next);
  return category;
}

// MOCK: stands in for DELETE /categories/:id
function localDelete(id: string): boolean {
  const all = load();
  const next = all.filter((category) => category.id !== id);
  persist(next);
  return next.length !== all.length;
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function getAll(): Promise<Category[]> {
  if (USE_MOCK) {
    return localGetAll();
  }
  return apiFetch<Category[]>("/api/v1/categories");
}

export async function create(input: CategoryInput): Promise<Category> {
  if (USE_MOCK) {
    return localCreate(input);
  }
  return apiFetch<Category>("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function remove(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return localDelete(id);
  }
  await apiFetch(`/api/v1/categories/${id}`, { method: "DELETE" });
  return true;
}

export async function isCategoryInUse(categoryName: string): Promise<boolean> {
  const transactions = await getAllTransactions();
  return transactions.some((transaction) => transaction.category === categoryName);
}
