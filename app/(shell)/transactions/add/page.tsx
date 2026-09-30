"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TransactionForm } from "@/components/TransactionForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { create } from "@/lib/stores/transaction-store";
import { getAll as getAllCategories } from "@/lib/stores/category-store";
import { Category, TransactionInput } from "@/types";

export default function AddTransactionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data);
      setIsLoading(false);
    });
  }, []);

  async function handleSubmit(input: TransactionInput) {
    await create(input);
    toast.success("Transaction added successfully.");
    router.push("/transactions");
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading form..." />;
  }

  return (
    <div className="mx-auto max-w-xl rounded-card border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary">
        Add Transaction
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Record a new income or expense entry.
      </p>
      <div className="mt-6">
        <TransactionForm
          categories={categories}
          submitLabel="Add Transaction"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/transactions")}
        />
      </div>
    </div>
  );
}
