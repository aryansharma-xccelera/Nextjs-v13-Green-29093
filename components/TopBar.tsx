"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/transactions/add": "Add Transaction",
  "/categories": "Categories",
  "/monthly-summary": "Monthly Summary",
};

function resolveTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }
  if (pathname.startsWith("/transactions/") && pathname.endsWith("/edit")) {
    return "Edit Transaction";
  }
  return "Expense Tracker";
}

export function TopBar() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 md:px-8">
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      <Link
        href="/transactions/add"
        className="flex items-center gap-2 rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="hidden sm:inline">Add Transaction</span>
      </Link>
    </header>
  );
}
