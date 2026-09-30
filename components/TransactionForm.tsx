"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Category, TransactionInput, TransactionType } from "@/types";
import {
  validateAmount,
  validateDate,
  validateRequiredString,
} from "@/lib/validation";
import { formatDateForInput } from "@/lib/utils";

interface TransactionFormProps {
  categories: Category[];
  initialValues?: TransactionInput;
  submitLabel: string;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
}

interface FormErrors {
  amount: string;
  category: string;
  date: string;
}

export function TransactionForm({
  categories,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount) : ""
  );
  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? "Expense"
  );
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [date, setDate] = useState(
    initialValues ? formatDateForInput(initialValues.date) : formatDateForInput(new Date().toISOString())
  );
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const errors: FormErrors = {
    amount: validateAmount(amount),
    category: validateRequiredString(category, "Category"),
    date: validateDate(date),
  };

  const isValid = !errors.amount && !errors.category && !errors.date;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setTouched(true);
      return;
    }
    onSubmit({
      amount: Number(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          onBlur={() => setTouched(true)}
          className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          placeholder="0.00"
        />
        <p className="mt-1 text-xs text-text-secondary">
          Must be a positive number greater than zero.
        </p>
        {touched && errors.amount && (
          <p className="mt-1 text-xs text-danger">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Type
        </label>
        <div className="flex gap-3">
          {(["Income", "Expense"] as TransactionType[]).map((option) => (
            <label
              key={option}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-input border px-4 py-2 text-sm font-medium transition-colors ${
                type === option
                  ? option === "Income"
                    ? "border-success bg-success/10 text-success"
                    : "border-danger bg-danger/10 text-danger"
                  : "border-border text-text-secondary"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={() => setType(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Category
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          onBlur={() => setTouched(true)}
          className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          {categories.length === 0 && <option value="">No categories available</option>}
          {categories.map((categoryOption) => (
            <option key={categoryOption.id} value={categoryOption.name}>
              {categoryOption.name}
            </option>
          ))}
        </select>
        {touched && errors.category && (
          <p className="mt-1 text-xs text-danger">{errors.category}</p>
        )}
        <Link
          href="/categories"
          className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
        >
          Manage categories
        </Link>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          onBlur={() => setTouched(true)}
          className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        {touched && errors.date && (
          <p className="mt-1 text-xs text-danger">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-text-primary">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          maxLength={200}
          className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          placeholder="Optional notes about this transaction"
        />
        <p className="mt-1 text-xs text-text-secondary">Optional, up to 200 characters.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-input border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
