"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TransactionForm } from "@/components/TransactionForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { getById, update } from "@/lib/stores/transaction-store";
import { getAll as getAllCategories } from "@/lib/stores/category-store";
import { Category, Transaction, TransactionInput } from "@/types";

export default function EditTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getById(params.id), getAllCategories()]).then(
      ([transactionData, categoryData]) => {
        setTransaction(transactionData ?? null);
        setCategories(categoryData);
        setIsLoading(false);
      }
    );
  }, [params.id]);

  async function handleSubmit(input: TransactionInput) {
    await update(params.id, input);
    toast.success("Transaction updated successfully.");
    router.push("/transactions");
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading transaction..." />;
  }

  if (!transaction) {
    return (
      <EmptyState
        message="This transaction could not be found."
        actionLabel="Back to Transactions"
        onAction={() => router.push("/transactions")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-card border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary">
        Edit Transaction
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Update the details for this transaction.
      </p>
      <div className="mt-6">
        <TransactionForm
          categories={categories}
          initialValues={transaction}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/transactions")}
        />
      </div>
    </div>
  );
}
