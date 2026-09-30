"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategoryBreakdownItem } from "@/types";
import { colorForCategoryIndex, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

interface CategoryBreakdownProps {
  items: CategoryBreakdownItem[];
  title?: string;
}

export function CategoryBreakdown({
  items,
  title = "Spending by Category",
}: CategoryBreakdownProps) {
  return (
    <div className="rounded-card border border-border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState message="No expense data yet." />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-52 w-full sm:w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={45}
                  outerRadius={80}
                >
                  {items.map((item, index) => (
                    <Cell key={item.category} fill={colorForCategoryIndex(index)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 space-y-2">
            {items.map((item, index) => (
              <li key={item.category} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colorForCategoryIndex(index) }}
                  />
                  {item.category}
                </span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(item.total)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
