"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  create,
  getAll,
  isCategoryInUse,
  remove,
} from "@/lib/stores/category-store";
import { Category } from "@/types";
import { validateCategoryName } from "@/lib/validation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [touched, setTouched] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadCategories() {
    setIsLoading(true);
    const data = await getAll();
    setCategories(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const predefinedCategories = categories.filter((category) => !category.isCustom);
  const customCategories = categories.filter((category) => category.isCustom);

  const errorMessage = validateCategoryName(
    newCategoryName,
    categories.map((category) => category.name)
  );
  const isValid = !errorMessage;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setTouched(true);
      return;
    }
    setIsSubmitting(true);
    await create({
      name: newCategoryName.trim(),
      isCustom: true,
      isActive: true,
    });
    setIsSubmitting(false);
    setNewCategoryName("");
    setTouched(false);
    toast.success("Category created successfully.");
    loadCategories();
  }

  async function handleRequestDelete(category: Category) {
    setDeleteError("");
    const inUse = await isCategoryInUse(category.name);
    if (inUse) {
      setDeleteError(
        "This category is used by one or more transactions and cannot be deleted."
      );
      return;
    }
    setPendingDelete(category);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) {
      return;
    }
    await remove(pendingDelete.id);
    setPendingDelete(null);
    toast.success("Category deleted successfully.");
    loadCategories();
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading categories..." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-card border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">
          Predefined Categories
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          These categories are built-in and cannot be deleted.
        </p>
        <ul className="mt-4 space-y-2">
          {predefinedCategories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-input border border-border px-3 py-2 text-sm"
            >
              <span className="text-text-primary">{category.name}</span>
              <span className="rounded-full bg-surface px-2 py-1 text-xs font-medium text-text-secondary">
                Predefined
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">
          Custom Categories
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Create your own categories. Categories still in use cannot be deleted.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Subscriptions"
              className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            {touched && errorMessage && (
              <p className="mt-1 text-xs text-danger">{errorMessage}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>

        {deleteError && (
          <p className="mt-3 rounded-input bg-danger/10 px-3 py-2 text-xs text-danger">
            {deleteError}
          </p>
        )}

        <div className="mt-4">
          {customCategories.length === 0 ? (
            <EmptyState message="No custom categories yet — create one above." />
          ) : (
            <ul className="space-y-2">
              {customCategories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between rounded-input border border-border px-3 py-2 text-sm"
                >
                  <span className="text-text-primary">{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRequestDelete(category)}
                    className="rounded-input border border-danger px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Delete category"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this category?"
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
